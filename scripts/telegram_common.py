"""Shared, credential-free Telegram feed normalization and scoring helpers."""

from __future__ import annotations

import re
from typing import Any


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


def compact_text(text: str, limit: int) -> str:
    value = re.sub(r"\s+", " ", text or "").strip()
    return value if len(value) <= limit else value[: limit - 1].rstrip() + "…"


def make_title(text: str) -> str:
    first_line = next((line.strip() for line in text.splitlines() if line.strip()), text)
    return compact_text(first_line, 150)


def public_safe_text(text: str) -> str:
    """Redact contact details before a post is persisted in the public repository."""
    value = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[已隐藏邮箱]", text, flags=re.I)
    value = re.sub(r"(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)", "[已隐藏号码]", value)
    return value


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
