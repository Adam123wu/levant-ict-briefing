#!/usr/bin/env python3
"""Route collected social posts into briefing and compliance topic candidates."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any


DEFAULT_FEED = Path("config/telegram-feed.json")
DEFAULT_ROUTING = Path("config/topic-source-routing.json")


def normalize(value: Any) -> str:
    return " ".join(str(value or "").casefold().split())


def route_item(item: dict[str, Any], topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    haystack = normalize(" ".join([
        str(item.get("title", "")),
        str(item.get("summary", "")),
        str(item.get("account", "")),
        str(item.get("owner", "")),
        str(item.get("category", "")),
        " ".join(map(str, item.get("matchedTerms", []))),
    ]))
    country = str(item.get("country", ""))
    category = str(item.get("category", ""))
    matches: list[dict[str, Any]] = []

    for topic in topics:
        if country not in topic.get("countries", []):
            continue
        keyword_hits = sorted({keyword for keyword in topic.get("keywords", []) if normalize(keyword) in haystack})
        category_hit = category in topic.get("sourceCategories", [])
        if topic.get("requireKeyword") and not keyword_hits:
            continue
        score = len(keyword_hits) + (2 if category_hit else 0)
        if score < int(topic.get("minScore", 1)):
            continue
        matches.append({
            "id": topic["id"],
            "label": topic["label"],
            "labelEn": topic["labelEn"],
            "destinations": topic.get("destinations", []),
            "destinationsEn": topic.get("destinationsEn", []),
            "score": score,
            "matchedKeywords": keyword_hits[:8],
        })

    return sorted(matches, key=lambda match: (-match["score"], match["id"]))


def route(feed_path: Path, routing_path: Path, check_only: bool) -> None:
    feed = json.loads(feed_path.read_text(encoding="utf-8"))
    routing = json.loads(routing_path.read_text(encoding="utf-8"))
    topics = routing.get("topics", [])
    if not topics:
        raise SystemExit("专题路由配置为空")

    counts: Counter[str] = Counter()
    unrouted: list[str] = []
    for item in feed.get("items", []):
        matches = route_item(item, topics)
        item["topicIds"] = [match["id"] for match in matches]
        item["topicLabels"] = [match["label"] for match in matches]
        item["topicLabelsEn"] = [match["labelEn"] for match in matches]
        item["targetSections"] = sorted({section for match in matches for section in match["destinations"]})
        item["targetSectionsEn"] = sorted({section for match in matches for section in match["destinationsEn"]})
        item["topicMatches"] = matches
        counts.update(item["topicIds"])
        if not matches:
            unrouted.append(str(item.get("id", "unknown")))

    feed["topicRouting"] = {
        "version": routing.get("version", 1),
        "routedItemCount": len(feed.get("items", [])) - len(unrouted),
        "unroutedItemCount": len(unrouted),
        "counts": dict(sorted(counts.items())),
        "unroutedIds": unrouted,
    }
    print(
        f"专题路由完成：{feed['topicRouting']['routedItemCount']}/{len(feed.get('items', []))} 条命中简报或合规专题"
    )
    if not check_only:
        feed_path.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="将已采集的社媒信息路由到双周简报与合规专题")
    parser.add_argument("--feed", type=Path, default=DEFAULT_FEED)
    parser.add_argument("--routing", type=Path, default=DEFAULT_ROUTING)
    parser.add_argument("--check", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    route(args.feed, args.routing, args.check)
