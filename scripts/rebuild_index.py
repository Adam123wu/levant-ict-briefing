#!/usr/bin/env python3
"""
扫描 issues/ 目录，自动重建 index.html 首页。
每次有新期 push 时被 GitHub Actions 触发。

用户 零代码 体验：只需上传 issues/w17-18.html，本脚本自动做剩下的事。
"""

import re
import sys
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parent.parent
ISSUES_DIR = ROOT / 'issues'
INDEX_FILE = ROOT / 'index.html'

# 黎凡特代表处 ICT 双周简报的起始年份
DEFAULT_YEAR = 2026


def parse_issue_filename(name):
    """'w15-16.html' → {'start_week': 15, 'end_week': 16}"""
    m = re.match(r'w(\d+)-(\d+)\.html$', name)
    if not m:
        return None
    return {
        'start_week': int(m.group(1)),
        'end_week': int(m.group(2)),
        'filename': name,
    }


def iso_week_to_dates(year, week):
    """ISO 周数 → (周一, 周日) 日期元组"""
    monday = datetime.strptime(f'{year}-W{week:02d}-1', '%G-W%V-%u')
    return monday, monday + timedelta(days=6)


def format_date_range(start, end):
    """生成中文日期范围字符串"""
    if start.month == end.month:
        return f"{start.year}年{start.month}月{start.day}日 — {end.day}日"
    return f"{start.year}年{start.month}月{start.day}日 — {end.month}月{end.day}日"


def extract_title(html_path):
    """从 HTML 提取本期主题标题"""
    content = html_path.read_text(encoding='utf-8')
    # 首选 retro-current 区的 retro-title
    m = re.search(
        r'<div class="retro-item retro-current">.*?<div class="retro-title">([^<]+)</div>',
        content, re.DOTALL
    )
    if m:
        return m.group(1).strip()
    # 次选 title 标签
    m = re.search(r'<title>([^<]+)</title>', content)
    if m:
        return m.group(1).replace('黎凡特代表处 ICT 双周简报', '').strip(' ·—-')
    return '(未能提取标题)'


def build_index(issues):
    """根据期数列表生成 index.html"""
    items_html = ''
    for i, issue in enumerate(issues):
        latest_class = 'issue-latest' if i == 0 else ''
        badge = '<span class="badge-latest">最新</span>' if i == 0 else ''
        items_html += f'''
    <a href="/issues/{issue['filename']}" class="issue {latest_class}">
      <div class="issue-head">
        <span class="issue-week">第 {issue['start_week']}—{issue['end_week']} 周</span>
        {badge}
      </div>
      <div class="issue-date">{issue['date_range']}</div>
      <div class="issue-title">{issue['title']}</div>
    </a>'''

    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>黎凡特代表处 ICT 双周简报</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;}}
body{{background:linear-gradient(135deg,#042C53 0%,#0A4A87 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}}
.card{{max-width:520px;width:100%;background:#fff;border-radius:16px;padding:36px 32px;box-shadow:0 10px 40px rgba(0,0,0,0.3);}}
h1{{font-size:22px;color:#042C53;margin-bottom:6px;}}
.sub{{font-size:13px;color:#888;margin-bottom:28px;}}
.issue-list{{display:flex;flex-direction:column;gap:12px;}}
.issue{{border:1px solid #e0ddd8;border-radius:10px;padding:16px 18px;text-decoration:none;color:#1a1a1a;transition:all 0.2s;display:block;}}
.issue:hover{{border-color:#042C53;background:#F8F9FC;transform:translateY(-1px);box-shadow:0 4px 12px rgba(4,44,83,0.1);}}
.issue-latest{{background:#FFF9E6;border-color:#E8C76F;}}
.issue-head{{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}}
.issue-week{{font-size:11px;background:#EDEAE4;color:#042C53;padding:3px 9px;border-radius:10px;font-weight:600;}}
.issue-latest .issue-week{{background:#E8C76F;color:#3D2F05;}}
.badge-latest{{font-size:10px;background:#E8C76F;color:#3D2F05;padding:2px 8px;border-radius:8px;font-weight:700;}}
.issue-date{{font-size:12px;color:#9a9a9a;margin-bottom:8px;}}
.issue-title{{font-size:14px;font-weight:600;color:#1a1a1a;}}
.footer{{margin-top:28px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center;line-height:1.6;}}
.footer b{{color:#B8860B;}}
.meta-info{{font-size:10px;color:#b4b2a9;margin-top:12px;text-align:center;}}
</style>
</head>
<body>
<div class="card">
  <h1>📊 黎凡特代表处 ICT 双周简报</h1>
  <div class="sub">华为伊拉克代表处 MSSD · 自动聚合 · {DEFAULT_YEAR}</div>
  
  <div class="issue-list">{items_html}
  </div>
  
  <div class="footer">
    🔐 访问已通过 Cloudflare Access 验证<br>
    如有任何技术问题和需求请联系 <b>吴昊 679001</b>
  </div>
  
  <div class="meta-info">
    自动构建于 {datetime.now().strftime('%Y-%m-%d %H:%M UTC')} · 共 {len(issues)} 期
  </div>
</div>
</body>
</html>
'''


def main():
    if not ISSUES_DIR.exists():
        print(f"ERROR: {ISSUES_DIR} 目录不存在", file=sys.stderr)
        sys.exit(1)

    issues = []
    for f in sorted(ISSUES_DIR.glob('w*.html')):
        meta = parse_issue_filename(f.name)
        if not meta:
            print(f"  ⊘ 跳过（文件名不符合 wN-N.html 规则）: {f.name}")
            continue
        try:
            start_date, _ = iso_week_to_dates(DEFAULT_YEAR, meta['start_week'])
            _, end_date = iso_week_to_dates(DEFAULT_YEAR, meta['end_week'])
        except ValueError as e:
            print(f"  ⚠️  跳过（周数非法）: {f.name}: {e}")
            continue
        meta['date_range'] = format_date_range(start_date, end_date)
        meta['title'] = extract_title(f)
        issues.append(meta)
        print(f"  ✓ {f.name} → 第 {meta['start_week']}—{meta['end_week']} 周 | {meta['title'][:40]}")

    if not issues:
        print("WARNING: 没有找到任何有效的简报文件", file=sys.stderr)
        sys.exit(0)

    # 按开始周倒序（最新在前）
    issues.sort(key=lambda x: x['start_week'], reverse=True)

    html = build_index(issues)
    INDEX_FILE.write_text(html, encoding='utf-8')
    print(f"\n✅ 已生成 index.html（{len(issues)} 期）")


if __name__ == '__main__':
    main()
