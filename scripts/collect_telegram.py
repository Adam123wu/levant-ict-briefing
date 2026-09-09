#!/usr/bin/env python3
"""Collect recent posts from configured Telegram sources into a public-safe JSON feed."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from telethon import TelegramClient
from telethon.sessions import StringSession


SOURCES_PATH = Path("config/sources.json")
OUTPUT_PATH = Path("config/telegram-feed.json")
LOCAL_ENV_PATH = Path(".secrets/telegram.env")

CRITICAL_TERMS = (
    "5g", "الجيل الخامس", "spectrum", "طيف", "frequency", "تردد", "license", "ترخيص",
    "tender", "مناقصة", "contract", "عقد", "shutdown", "إغلاق", "ban", "حظر",
    "court", "محكمة", "law", "قانون", "regulation", "تنظيم", "sanction", "عقوبات",
)
BUSINESS_TERMS = (
    "telecom", "اتصالات", "internet", "إنترنت", "fiber", "ألياف", "data center",
    "مركز بيانات", "cloud", "سحابة", "cyber", "سيبراني", "digital", "رقمي",
    "investment", "استثمار", "procurement", "شراء", "ai", "ذكاء اصطناعي",
)


def load_local_env() -> None:
    """Load the ignored local env file for manual runs; never print its values."""
    if not LOCAL_ENV_PATH.exists():
        return
    for raw_line in LOCAL_ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        os.environ.setdefault(name.strip(), value.strip())


def require_credentials() -> tuple[int, str, str]:
    load_local_env()
    api_id = os.environ.get("TG_API_ID", "").strip()
    api_hash = os.environ.get("TG_API_HASH", "").strip()
    session = os.environ.get("TG_SESSION", "").strip()
    missing = [name for name, value in (("TG_API_ID", api_id), ("TG_API_HASH", api_hash), ("TG_SESSION", session)) if not value]
    if missing:
        raise SystemExit(f"缺少凭据：{', '.join(missing)}。请先运行 scripts/telegram_authorize.py。")
    if not api_id.isdigit():
        raise SystemExit("TG_API_ID 必须是数字")
    return int(api_id), api_hash, session


def compact_text(text: str, limit: int) -> str:
    value = re.sub(r"\s+", " ", text or "").strip()
    return value if len(value) <= limit else value[: limit - 1].rstrip() + "…"


def make_title(text: str) -> str:
    first_line = next((line.strip() for line in text.splitlines() if line.strip()), text)
    return compact_text(first_line, 150)


def importance(source: dict[str, Any], text: str, views: int, forwards: int) -> tuple[str, int, list[str]]:
    haystack = text.casefold()
    matched_critical = sorted({term for term in CRITICAL_TERMS if term.casefold() in haystack})
    matched_business = sorted({term for term in BUSINESS_TERMS if term.casefold() in haystack})
    score = 3 if source.get("tier") == "T1" else 1
    score += min(4, len(matched_critical) * 2)
    score += min(2, len(matched_business))
    if views >= 10_000 or forwards >= 100:
        score += 1
    priority = "最高" if score >= 8 else "高" if score >= 5 else "中"
    return priority, score, (matched_critical + matched_business)[:8]


async def collect(days: int, max_per_source: int, dry_run: bool) -> None:
    api_id, api_hash, session = require_credentials()
    sources = json.loads(SOURCES_PATH.read_text(encoding="utf-8"))
    telegram_sources = [source for source in sources if source.get("platform") == "Telegram" and source.get("handle")]
    if not telegram_sources:
        raise SystemExit("config/sources.json 中没有 Telegram 信源")

    client = TelegramClient(StringSession(session), api_id, api_hash)
    await client.connect()
    try:
        if not await client.is_user_authorized():
            raise SystemExit("TG_SESSION 已失效或未授权；请重新运行 scripts/telegram_authorize.py")

        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        collected_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        items: list[dict[str, Any]] = []
        errors: list[dict[str, str]] = []
        counts: Counter[str] = Counter()

        for source in telegram_sources:
            handle = str(source["handle"]).lstrip("@")
            try:
                entity = await client.get_entity(handle)
                async for message in client.iter_messages(entity, limit=max_per_source):
                    message_date = message.date.astimezone(timezone.utc)
                    if message_date < cutoff:
                        break
                    text = (message.message or "").strip()
                    if not text:
                        continue
                    views = int(message.views or 0)
                    forwards = int(message.forwards or 0)
                    priority, score, matched_terms = importance(source, text, views, forwards)
                    counts[source["id"]] += 1
                    items.append({
                        "id": f"tg-{handle.casefold()}-{message.id}",
                        "messageId": message.id,
                        "date": message_date.date().isoformat(),
                        "publishedAt": message_date.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
                        "country": source.get("country", "待分类"),
                        "platform": "Telegram",
                        "account": source.get("name", handle),
                        "owner": source.get("owner", ""),
                        "handle": handle,
                        "category": source.get("category", "官方动态"),
                        "tier": source.get("tier", "T2"),
                        "priority": priority,
                        "importanceScore": score,
                        "matchedTerms": matched_terms,
                        "title": make_title(text),
                        "summary": compact_text(text, 520),
                        "views": views,
                        "forwards": forwards,
                        "url": f"https://t.me/{handle}/{message.id}",
                    })
            except Exception as exc:  # Continue collecting healthy sources without leaking credentials.
                errors.append({"sourceId": str(source.get("id", handle)), "error": type(exc).__name__})
                print(f"警告：@{handle} 采集失败（{type(exc).__name__}）", file=sys.stderr)

        if not items and errors:
            raise SystemExit("所有 Telegram 信源均采集失败，已保留现有数据")

        items.sort(key=lambda item: (item["publishedAt"], item["importanceScore"]), reverse=True)
        payload = {
            "generatedAt": collected_at,
            "windowDays": days,
            "sourceCount": len(telegram_sources) - len(errors),
            "messageCount": len(items),
            "errors": errors,
            "items": items,
        }

        for source in sources:
            if source.get("platform") == "Telegram" and source.get("id") in counts:
                source["posts14d"] = counts[source["id"]] if days == 14 else source.get("posts14d")
                source["lastCollectedAt"] = collected_at
                source["status"] = "正常"

        print(f"采集完成：{len(items)} 条消息，{len(telegram_sources) - len(errors)}/{len(telegram_sources)} 个信源成功")
        if not dry_run:
            OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            SOURCES_PATH.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    finally:
        await client.disconnect()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="采集配置表中的 Telegram 官方信源")
    parser.add_argument("--days", type=int, default=14, choices=range(1, 31), metavar="1-30")
    parser.add_argument("--max-per-source", type=int, default=150)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(collect(args.days, args.max_per_source, args.dry_run))
