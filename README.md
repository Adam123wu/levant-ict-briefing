# 黎凡特 ICT 情报中心

面向伊拉克、约旦、黎巴嫩市场的双周 ICT 决策情报站。站点使用 Next.js 静态导出，并通过 GitHub Pages 公开部署。

## 功能

- 决策总览：新闻、商机、国家分布、趋势和采集健康度
- 双周简报：三国环境评分、新闻、商业机会及重要官方社媒快讯
- 合规与营商：六维加权评分、国家风险、证据链、监控事项和行动建议
- 政府人员：78 个关键岗位，可搜索、按国家筛选、排序和分页
- 多平台信源：19 个已核验的政府官员、通信部、监管机构及政府账号，覆盖 X、Telegram、Facebook
- Telegram 自动监测：按信源配置抓取最近 14 天官方频道动态，初筛重点 ICT、监管、招标与合规信号
- 历史归档：保留旧版报告入口

## 技术栈

- Next.js 15（静态导出）
- React 19
- Shadcn 风格组件体系
- Tremor 图表
- TanStack Table
- GitHub Actions + GitHub Pages

## 本地运行

```bash
npm install --legacy-peer-deps
npm run dev
```

数据由 `scripts/sync-data.mjs` 自动识别 `legacy/` 中的最新简报，并将报告、归档、人员清单、`config/sources.json` 多平台信源、`config/social-signals.json` 重要社媒动态以及 `config/compliance-analysis.json` 合规营商分析同步到 `data/`。该脚本在每次构建前自动执行。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会安装依赖、生成静态站点并部署到 GitHub Pages。

## Telegram 自动采集授权

Telegram API ID/API Hash 不能单独读取用户频道；需要在本机完成一次账户授权并生成可撤销的会话。验证码和二步验证密码只在本机输入，不保存到仓库或 GitHub。

```bash
python3 -m venv .venv-telegram
.venv-telegram/bin/pip install -r requirements-telegram.txt
.venv-telegram/bin/python scripts/telegram_authorize.py --repo Adam123wu/levant-ict-briefing
gh workflow run telegram-refresh.yml -R Adam123wu/levant-ict-briefing
```

授权脚本不会创建明文凭据文件。API ID、API Hash、手机号、验证码和二步验证密码只存在于首次授权进程内；生成会话后，脚本通过标准输入直接调用 GitHub CLI，将 `TG_API_ID`、`TG_API_HASH`、`TG_SESSION` 加密写入 GitHub Actions Secrets。建议使用专门的只读监控账号；如需撤销，请在 Telegram「设置 → 设备」终止对应会话，并删除或重新生成 `TG_SESSION`。

定时任务 `.github/workflows/telegram-refresh.yml` 在每周日巴格达时间 01:30 预先抓取 `config/sources.json` 中所有 Telegram 信源，更新公开安全的 `config/telegram-feed.json`；02:00 的简报任务随后完成中文研判和发布。

© 2026 伊拉克代表处 · 吴昊 679001 · MSSD AI 团队
