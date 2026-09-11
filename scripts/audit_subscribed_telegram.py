#!/usr/bin/env python3
"""Audit subscribed public Telegram broadcast channels without exposing private dialogs."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from telethon import TelegramClient
from telethon.sessions import StringSession


COUNTRY_TERMS = {
    "伊拉克": [
        "iraq", "iraqi", "baghdad", "kurdistan", "erbil", "العراق", "عراقي", "بغداد", "كردستان", "أربيل",
        "ina", "alsumaria", "shafaq", "rudaw", "kurdistan24", "alsharqiya", "alrabiaa", "utv iraq",
        "السومرية", "شفق", "روداو", "الشرقية", "الرابعة",
        "zain iraq", "asiacell", "korek", "earthlink", "iq networks", "newroz",
    ],
    "约旦": [
        "jordan", "jordanian", "amman", "الأردن", "اردني", "عمان",
        "petra", "almamlaka", "roya", "alghad", "ammon news", "jordan times",
        "بترا", "المملكة", "رؤيا", "الغد", "عمون",
        "zain jordan", "orange jordan", "umniah", "modee", "trc jordan",
    ],
    "黎巴嫩": [
        "lebanon", "lebanese", "beirut", "لبنان", "لبناني", "بيروت",
        "nna lebanon", "lbci", "mtv lebanon", "al jadeed", "aljadeed", "annahar", "nidaa al watan", "lorient", "naharnet", "lebanon24",
        "الوطنية للإعلام", "الجديد", "النهار", "نداء الوطن", "الميادين",
        "ogero", "alfa telecom", "touch lebanon", "mpt lebanon", "tra lebanon",
    ],
}

CATEGORY_TERMS = {
    "新闻媒体": [
        "news", "media", "tv", "channel", "agency", "newspaper", "radio", "press",
        "أخبار", "اخبار", "نيوز", "إعلام", "اعلام", "قناة", "وكالة", "صحيفة",
        "ina", "alsumaria", "shafaq", "rudaw", "kurdistan24", "alsharqiya", "petra", "almamlaka", "roya", "alghad", "ammon", "lbci", "aljadeed", "annahar", "lorient", "naharnet",
    ],
    "政府与监管": [
        "ministry", "minister", "government", "commission", "authority", "parliament", "court", "official", "central bank",
        "وزارة", "وزير", "حكومة", "هيئة", "مجلس", "برلمان", "محكمة", "رسمي", "البنك المركزي",
    ],
    "通信与 ICT": [
        "telecom", "communications", "mobile", "internet", "digital", "technology", "5g", "fiber", "data center", "cloud", "cyber",
        "اتصالات", "موبايل", "إنترنت", "انترنت", "رقمي", "تكنولوجيا", "ألياف", "الياف", "سحابة",
        "zain", "asiacell", "korek", "earthlink", "orange", "umniah", "ogero", "alfa", "touch",
    ],
    "企业与经济": [
        "business", "economy", "economic", "bank", "investment", "company", "corporate", "energy", "oil", "electricity", "tender", "procurement",
        "أعمال", "اعمال", "اقتصاد", "بنك", "استثمار", "شركة", "طاقة", "نفط", "كهرباء", "مناقصة", "مشتريات",
    ],
}


def normalize(value: str) -> str:
    return " ".join((value or "").casefold().replace("_", " ").replace("-", " ").split())


def matches(text: str, terms: list[str]) -> list[str]:
    return sorted({term for term in terms if normalize(term) in text})


def classify(name: str, username: str) -> tuple[list[str], list[str], list[str]]:
    text = normalize(f"{name} {username}")
    country_hits = {country: matches(text, terms) for country, terms in COUNTRY_TERMS.items()}
    countries = [country for country, hits in country_hits.items() if hits]
    category_hits = {category: matches(text, terms) for category, terms in CATEGORY_TERMS.items()}
    categories = [category for category, hits in category_hits.items() if hits]
    matched_terms = sorted({term for hits in country_hits.values() for term in hits} | {term for hits in category_hits.values() for term in hits})
    return countries, categories, matched_terms


def require_credentials() -> tuple[int, str, str]:
    values = {name: os.environ.get(name, "").strip() for name in ("TG_API_ID", "TG_API_HASH", "TG_SESSION")}
    missing = [name for name, value in values.items() if not value]
    if missing:
        raise SystemExit(f"Missing required Telegram Secrets: {', '.join(missing)}")
    if not values["TG_API_ID"].isdigit():
        raise SystemExit("TG_API_ID must be numeric")
    return int(values["TG_API_ID"]), values["TG_API_HASH"], values["TG_SESSION"]


async def audit(output_path: Path) -> None:
    api_id, api_hash, session = require_credentials()
    client = TelegramClient(StringSession(session), api_id, api_hash)
    await client.connect()
    try:
        if not await client.is_user_authorized():
            raise SystemExit("TG_SESSION is invalid or no longer authorized")

        public_broadcast_count = 0
        candidates: list[dict[str, Any]] = []
        seen_handles: set[str] = set()

        async for dialog in client.iter_dialogs():
            entity = dialog.entity
            username = str(getattr(entity, "username", "") or "").lstrip("@")
            is_public_broadcast = bool(getattr(entity, "broadcast", False) and username)
            if not is_public_broadcast:
                continue
            public_broadcast_count += 1
            handle_key = username.casefold()
            if handle_key in seen_handles:
                continue
            seen_handles.add(handle_key)
            countries, categories, matched_terms = classify(str(dialog.name or ""), username)
            if not countries or not categories:
                continue
            candidates.append({
                "id": f"tg-candidate-{handle_key}",
                "platform": "Telegram",
                "handle": username,
                "url": f"https://t.me/{username}",
                "name": str(dialog.name or username),
                "countries": countries,
                "categories": categories,
                "matchedTerms": matched_terms[:12],
                "status": "待官网反向核验",
            })

        candidates.sort(key=lambda item: (item["countries"], item["categories"], item["name"].casefold()))
        country_counts = Counter(country for item in candidates for country in item["countries"])
        category_counts = Counter(category for item in candidates for category in item["categories"])
        payload = {
            "generatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "authorization": "valid",
            "scope": "subscribed public broadcast channels only",
            "privacy": "Private chats, contacts, private channels and groups are excluded and not listed.",
            "publicBroadcastCount": public_broadcast_count,
            "candidateCount": len(candidates),
            "countryCounts": dict(sorted(country_counts.items())),
            "categoryCounts": dict(sorted(category_counts.items())),
            "candidates": candidates,
        }
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(
            f"Authorization valid; scanned {public_broadcast_count} public broadcast channels; "
            f"identified {len(candidates)} relevant candidates. Private dialogs were excluded."
        )
    finally:
        await client.disconnect()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit subscribed public Telegram channels")
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(audit(args.output))
