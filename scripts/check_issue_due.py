#!/usr/bin/env python3
"""
检查是否需要出新期简报（定时任务调用）。

逻辑:
- 每双周一检查一次
- 如果最新期 > 14 天未更新, 输出 due=true
- GitHub Actions 接收到 due=true 就创建 Issue 提醒
"""

import os
import re
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent.parent
ISSUES_DIR = ROOT / 'issues'
DEFAULT_YEAR = 2026


def main():
    if not ISSUES_DIR.exists():
        _set_output('due', 'true')
        _set_output('message', '仓库还没有任何期数，请生成第一期。')
        return

    # 找最新期
    weeks = []
    for f in ISSUES_DIR.glob('w*.html'):
        m = re.match(r'w(\d+)-(\d+)\.html$', f.name)
        if m:
            weeks.append((int(m.group(1)), int(m.group(2)), f.name))

    if not weeks:
        _set_output('due', 'true')
        _set_output('message', '仓库还没有任何期数，请生成第一期。')
        return

    weeks.sort(reverse=True)
    latest_start, latest_end, latest_file = weeks[0]

    # 最新期的结束周 + 1 周后算是下期开始日
    try:
        next_monday = datetime.strptime(
            f'{DEFAULT_YEAR}-W{latest_end + 1:02d}-1', '%G-W%V-%u'
        )
    except ValueError:
        # 年份换了
        next_monday = datetime.strptime(
            f'{DEFAULT_YEAR + 1}-W01-1', '%G-W%V-%u'
        )

    now = datetime.now()
    days_since_due = (now - next_monday).days

    # 下一期开始日 ≥ 今天: 还没到
    # 下一期开始日 < 今天: 已经开始, 应该出新期
    if days_since_due < 0:
        days_to = -days_since_due
        _set_output('due', 'false')
        _set_output('message', f'最新期是 W{latest_start}-{latest_end}，距下期开始还有 {days_to} 天。')
        print(f'✅ 暂未到期 · 最新 W{latest_start}-{latest_end} · {days_to} 天后开始下一期')
    else:
        next_w1 = latest_end + 1
        next_w2 = latest_end + 2
        _set_output('due', 'true')
        _set_output('next_weeks', f'{next_w1}-{next_w2}')
        _set_output('message', f'已超过下期开始日 {days_since_due} 天，请生成第 {next_w1}—{next_w2} 周双周简报。')
        print(f'⚠️ 已到期 · 请生成 W{next_w1}-{next_w2} · 已超期 {days_since_due} 天')


def _set_output(key, value):
    """输出变量到 GitHub Actions"""
    github_output = os.environ.get('GITHUB_OUTPUT')
    if github_output:
        with open(github_output, 'a') as f:
            f.write(f'{key}={value}\n')
    else:
        # 本地调试
        print(f'::set-output::{key}={value}')


if __name__ == '__main__':
    main()
