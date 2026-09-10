#!/usr/bin/env python3
"""Collect public Telegram channel previews without an account or API credentials."""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
from collections import Counter
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from telegram_common import compact_text, importance, make_title, public_safe_text


SOURCES_PATH = Path("config/sources.json")
OUTPUT_PATH = Path("config/telegram-feed.json")
USER_AGENT = "LevantICTBriefing/1.0 (+https://github.com/Adam123wu/levant-ict-briefing)"


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "br":
            self.parts.append("\n")

    def text(self) -> str:
        return "".join(self.parts).strip()


def strip_html(fragment: str) -> str:
    parser = TextExtractor()
    parser.feed(html.unescape(fragment))
    return parser.text()


def metric_value(raw: str) -> int:
    value = raw.strip().replace(",", "").upper()
    match = re.fullmatch(r"([0-9]+(?:\.[0-9]+)?)([KM]?)", value)
    if not match:
        return 0
    amount = float(match.group(1))
    multiplier = {"": 1, "K": 1_000, "M": 1_000_000}[match.group(2)]
    return int(amount * multiplier)


def parse_page(page: str, expected_handle: str) -> list[dict[str, Any]]:
    starts = list(re.finditer(r'<div class="tgme_widget_message_wrap[^>]*>', page))
    posts: list[dict[str, Any]] = []
    for index, start in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(page)
        block = page[start.start():end]
        post_match = re.search(r'data-post="([^"/]+)/([0-9]+)"', block)
        date_match = re.search(r'<time[^>]+datetime="([^"]+)"', block)
        text_match = re.search(r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>', block, re.S)
        if not post_match or not date_match or not text_match:
            continue
        handle, message_id_text = post_match.groups()
        if handle.casefold() != expected_handle.casefold():
            continue
        try:
            published_at = datetime.fromisoformat(date_match.group(1).replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            continue
        text = strip_html(text_match.group(1))
        if not text:
            continue
        views_match = re.search(r'<span class="tgme_widget_message_views">([^<]+)</span>', block)
        posts.append({
            "messageId": int(message_id_text),
            "publishedAt": published_at,
            "text": text,
            "views": metric_value(views_match.group(1)) if views_match else 0,
        })
    return posts


def fetch_page(handle: str, before: int | None = None) -> str:
    query = f"?{urlencode({'before': before})}" if before else ""
    request = Request(f"https://t.me/s/{handle}{query}", headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=25) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP{response.status}")
        return response.read().decode("utf-8", errors="replace")


def collect_source(source: dict[str, Any], cutoff: datetime, max_pages: int) -> list[dict[str, Any]]:
    handle = str(source["handle"]).lstrip("@")
    seen: set[int] = set()
    posts: list[dict[str, Any]] = []
    before: int | None = None
    for _ in range(max_pages):
        page_posts = parse_page(fetch_page(handle, before), handle)
        fresh_posts = [post for post in page_posts if post["messageId"] not in seen]
        if not fresh_posts:
            break
        for post in fresh_posts:
            seen.add(post["messageId"])
            if post["publishedAt"] >= cutoff:
                posts.append(post)
        oldest = min(post["publishedAt"] for post in fresh_posts)
        if oldest < cutoff:
            break
        next_before = min(post["messageId"] for post in fresh_posts)
        if before == next_before:
            break
        before = next_before
        time.sleep(0.25)
    return posts


def collect(days: int, max_pages: int, dry_run: bool) -> None:
    sources = json.loads(SOURCES_PATH.read_text(encoding="utf-8"))
    telegram_sources = [source for source in sources if source.get("platform") == "Telegram" and source.get("handle")]
    if not telegram_sources:
        raise SystemExit("config/sources.json 中没有 Telegram 信源")

    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    collected_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    items: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []
    counts: Counter[str] = Counter()
    scanned_message_count = 0

    for source in telegram_sources:
        handle = str(source["handle"]).lstrip("@")
        try:
            posts = collect_source(source, cutoff, max_pages)
            counts[source["id"]] = len(posts)
            scanned_message_count += len(posts)
            for post in posts:
                priority, score, matched_terms = importance(source, post["text"], post["views"], 0)
                if priority == "中":
                    continue
                safe_text = public_safe_text(post["text"])
                published_at: datetime = post["publishedAt"]
                items.append({
                    "id": f"tg-{handle.casefold()}-{post['messageId']}",
                    "messageId": post["messageId"],
                    "date": published_at.date().isoformat(),
                    "publishedAt": published_at.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
                    "country": source.get("country", "待分类"),
                    "platform": "Telegram Public Web",
                    "account": source.get("name", handle),
                    "owner": source.get("owner", ""),
                    "handle": handle,
                    "category": source.get("category", "官方动态"),
                    "tier": source.get("tier", "T2"),
                    "priority": priority,
                    "importanceScore": score,
                    "matchedTerms": matched_terms,
                    "title": make_title(safe_text),
                    "summary": compact_text(safe_text, 520),
                    "views": post["views"],
                    "forwards": 0,
                    "url": f"https://t.me/{handle}/{post['messageId']}",
                })
        except (HTTPError, URLError, TimeoutError, RuntimeError) as exc:
            errors.append({"sourceId": str(source.get("id", handle)), "error": type(exc).__name__})
            print(f"警告：@{handle} 公开页面采集失败（{type(exc).__name__}）", file=sys.stderr)

    if not items and errors:
        raise SystemExit("所有 Telegram 公开信源均采集失败，已保留现有数据")

    items.sort(key=lambda item: (item["publishedAt"], item["importanceScore"]), reverse=True)
    payload = {
        "generatedAt": collected_at,
        "collectionMode": "public-web",
        "selection": "important-only",
        "windowDays": days,
        "sourceCount": len(telegram_sources) - len(errors),
        "scannedMessageCount": scanned_message_count,
        "messageCount": len(items),
        "errors": errors,
        "items": items,
    }
    for source in sources:
        if source.get("platform") == "Telegram" and source.get("id") in counts:
            source["posts14d"] = counts[source["id"]] if days == 14 else source.get("posts14d")
            source["lastCollectedAt"] = collected_at
            source["status"] = "正常"

    print(f"公开页面采集完成：{len(items)} 条消息，{len(telegram_sources) - len(errors)}/{len(telegram_sources)} 个信源成功")
    if not dry_run:
        OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        SOURCES_PATH.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="无需登录采集 Telegram 公开频道")
    parser.add_argument("--days", type=int, default=14, choices=range(1, 31), metavar="1-30")
    parser.add_argument("--max-pages", type=int, default=8)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    collect(args.days, args.max_pages, args.dry_run)
