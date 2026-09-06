# 黎凡特 ICT 情报中心

面向伊拉克、约旦、黎巴嫩市场的双周 ICT 决策情报站。站点使用 Next.js 静态导出，并通过 GitHub Pages 公开部署。

## 功能

- 决策总览：新闻、商机、国家分布、趋势和采集健康度
- 双周简报：三国环境评分、新闻和商业机会
- 政府人员：78 个关键岗位，可搜索、按国家筛选、排序和分页
- Telegram 信源：6 个已接入的伊拉克政府/监管机构频道
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

数据由 `scripts/sync-data.mjs` 从已核验的简报和人员清单同步到 `data/`，并在每次构建前自动执行。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会安装依赖、生成静态站点并部署到 GitHub Pages。

© 2026 伊拉克代表处 · 吴昊 679001 · MSSD AI 团队
