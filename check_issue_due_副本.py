#!/usr/bin/env python3
"""
检查是否需要出新期简报 (定时任务调用)。
"""

import os
import re
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_YEAR = 2026


def main():
    weeks = []
    for f in ROOT.glob('w*-*.html'):
        m = re.match(r'^w(\d+)-(\d+)\.html$', f.name)
        if m:
            weeks.append((int(m.group(1)), int(m.group(2))))

    if not weeks:
        _out('due', 'true')
        _out('message', 'no issues yet, please generate the first one')
        return

    weeks.sort(reverse=True)
    latest_start, latest_end = weeks[0]

    try:
        next_monday = datetime.strptime(f'{DEFAULT_YEAR}-W{latest_end + 1:02d}-1', '%G-W%V-%u')
    except ValueError:
        next_monday = datetime.strptime(f'{DEFAULT_YEAR + 1}-W01-1', '%G-W%V-%u')

    now = datetime.now()
    days = (now - next_monday).days

    if days < 0:
        _out('due', 'false')
        _out('message', f'W{latest_start}-{latest_end} is latest, next in {-days} days')
        print(f'Not due yet, latest W{latest_start}-{latest_end}, {-days} days left')
    else:
        nw1, nw2 = latest_end + 1, latest_end + 2
        _out('due', 'true')
        _out('next_weeks', f'{nw1}-{nw2}')
        _out('message', f'overdue {days} days, please generate W{nw1}-{nw2}')
        print(f'Due: please generate W{nw1}-{nw2}, overdue {days} days')


def _out(key, value):
    github_output = os.environ.get('GITHUB_OUTPUT')
    if github_output:
        with open(github_output, 'a') as f:
            f.write(f'{key}={value}\n')
    else:
        print(f'[{key}={value}]')


if __name__ == '__main__':
    main()
