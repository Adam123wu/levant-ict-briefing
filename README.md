# 黎凡特代表处 ICT 双周简报

华为伊拉克代表处 MSSD 自动聚合的地区 ICT 情报双周简报。

🌐 **访问入口**: 部署后直接访问根域名 = 最新期简报
🔐 **访问控制**: 公开（任何人有链接即可查看）
📞 **技术支持**: 吴昊 工号 679001

## 📁 新结构（简化版）

```
levant-ict-briefing/
├── index.html               ← 最新期副本（= w20-21.html，自动生成）
├── w15-16.html              ← 第 15—16 周（根目录）
├── w13-14.html              ← 第 13—14 周（根目录）
├── _headers / _redirects / netlify.toml
├── .github/workflows/
│   ├── auto-index.yml       ← push 触发: 自动更新 index.html
│   └── biweekly-reminder.yml ← 定时: 每周一早8点检查提醒
├── scripts/
│   ├── rebuild_index.py
│   └── check_issue_due.py
└── .gitignore
```

**访问路径**:
- `/` → 最新期（自动指向 w15-16）
- `/w15-16.html` → 第 15—16 周
- `/w13-14.html` → 第 13—14 周
- `/latest` → 302 重定向到最新期

## 🔄 每两周更新流程

1. 跟 Claude 生成新一期 HTML, 命名为 `w17-18.html`
2. GitHub 网页: 仓库页 → **Add file** → **Upload files** → 拖入 w17-18.html → Commit
3. GitHub Actions 自动:
   - 扫描识别 w17-18 为最新期
   - 复制为 index.html
   - 提交 + 推送
4. Netlify 自动重新部署 (约 30 秒)
5. 访问根域名 → 看到新期 ✅

## 🛠️ 首次部署步骤

### Step 1. 创建 GitHub 私有仓库
- https://github.com/new → 名称: `levant-ict-briefing` → Private → Create

### Step 2. 上传所有文件
- 用 git push 或 GitHub Desktop 或网页上传

### Step 3. 开启 Actions 写权限（关键）
- 仓库 → Settings → Actions → General
- Workflow permissions: 选 ✅ **Read and write permissions** → Save

### Step 4. Netlify 部署
- https://app.netlify.com → Add new site → Import from GitHub
- 选仓库 → Build command 留空, Publish directory `.`
- Deploy site
- 1-2 分钟获得 URL: `https://<name>.netlify.app`
- Site configuration → Change site name → 改成 `levant-ict-briefing`

### Step 5. 测试
- 打开 `https://levant-ict-briefing.netlify.app` → 应直接显示最新期
- 点击 📚 历史双周回顾 → 点上一期 → 跳转到 w13-14
- 点击 🔐 其他参考消息 → 输入 `huawei123` 解锁

## 🚨 已知问题排查

### 跨期跳转打不开
- 确保是**部署到 Netlify 后**访问, 不要本地双击 HTML
- 本地 `file://` 协议下绝对路径 `/w13-14.html` 会报错, 这是正常的

### Actions 报错 "fatal: unable to push"
- 必须完成 **Step 3 的写权限开启**

### index.html 没自动更新
- 看仓库 Actions 标签是否有红叉
- 点进去看日志, 通常是权限问题

## 📞 联系
技术问题: **吴昊 679001**

## 📜 版权
© 2026 华为伊拉克代表处 MSSD · 仅供内部参考 · 请勿外传
