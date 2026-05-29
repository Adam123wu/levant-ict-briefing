#!/usr/bin/env python3
"""
扫描根目录找所有 wN-N.html, 自动把最新期复制为 index.html。

用户只需把新期 HTML 放到根目录 push, 本脚本由 GitHub Actions 触发后自动:
- 识别最新期
- 把它复制为 index.html (网站首页 = 最新期)
- 用户访问根域名 / 直接看到最新简报
"""

import re
import sys
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_FILE = ROOT / 'index.html'


def parse_week(name):
    """'w15-16.html' -> (15, 16)"""
    m = re.match(r'^w(\d+)-(\d+)\.html$', name)
    if not m:
        return None
    return (int(m.group(1)), int(m.group(2)))


def main():
    # 扫描根目录所有 wN-N.html (排除 index.html)
    issues = []
    for f in sorted(ROOT.glob('w*-*.html')):
        weeks = parse_week(f.name)
        if weeks:
            issues.append((weeks, f))
            print(f"  found: {f.name} -> week {weeks[0]}-{weeks[1]}")

    if not issues:
        print("ERROR: no w*-*.html files found", file=sys.stderr)
        sys.exit(1)

    issues.sort(key=lambda x: x[0], reverse=True)
    latest_weeks, latest_file = issues[0]

    shutil.copy2(latest_file, INDEX_FILE)
    print(f"\nOK: index.html = {latest_file.name} (W{latest_weeks[0]}-{latest_weeks[1]})")
    print(f"Total {len(issues)} issues")


if __name__ == '__main__':
    main()
