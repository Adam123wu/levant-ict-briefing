# 黎凡特代表处 ICT 双周简报 · 自动化部署

华为伊拉克代表处 MSSD 自动聚合的地区 ICT 情报双周简报站点。

🌐 **访问入口**: https://levant-ict-briefing.pages.dev（替换为你的实际 Cloudflare Pages 域名）

🔐 **访问控制**: Cloudflare Access 邮箱白名单

📞 **技术支持**: 吴昊 工号 679001

---

## ✨ 核心自动化特性

| 你做什么 | 系统做什么 |
|---------|---------|
| 把新期 HTML 上传到 `issues/` 目录 | ✅ 自动重建 `index.html` 首页 |
| 无操作 | ✅ 每双周一早 8 点（巴格达）自动提醒 |
| 无操作 | ✅ Cloudflare Pages 自动重新部署 |

## 🚀 日常更新流程（每两周）

### 方式 A：网页操作（推荐给不熟命令行）

1. 跟 Claude 要新一期 HTML，命名为 `wN-N+1.html`（如 `w17-18.html`）
2. 打开本仓库网页，点 `issues` 目录
3. 点 **Add file → Upload files**
4. 拖入新 HTML，填 commit message 后点 Commit
5. 等 30 秒，GitHub Actions 自动完成：
   - 重建 `index.html` 把新期置顶
   - Cloudflare Pages 重新部署
6. 刷新网站即可看到新期 ✅

### 方式 B：命令行

```bash
git pull
cp ~/Downloads/w17-18.html issues/
git add issues/w17-18.html
git commit -m "w17-18: 第17—18周双周简报"
git push
```

## 📁 文件结构

```
levant-ict-briefing/
├── .github/workflows/
│   ├── auto-index.yml            # push 触发: 重建首页
│   └── biweekly-reminder.yml     # cron: 定时提醒
├── scripts/
│   ├── rebuild_index.py          # 扫描 issues/ 生成首页
│   └── check_issue_due.py        # 检查是否该出新期
├── issues/
│   ├── w13-14.html               # 第 13—14 周 (2026-03-23 → 04-06)
│   └── w15-16.html               # 第 15—16 周 (2026-04-07 → 04-21)
├── index.html                    # 🤖 自动生成，勿手动编辑
├── _headers                      # Cloudflare 安全头
├── _redirects                    # URL 重写
├── .gitignore
└── README.md
```

## 🛠️ 首次部署步骤（一次性设置）

### Step 1. 创建 GitHub 私有仓库

- 访问 https://github.com/new
- 名称: `levant-ict-briefing`
- **Private** ✅
- 不勾选 "Add a README"、".gitignore"、"License"
- 点 **Create repository**

### Step 2. 上传本项目所有文件

**网页方式**（简单）：
- 仓库页点 "uploading an existing file"
- 把本项目解压后**全部文件和目录**拖进去（包括 `.github` 隐藏目录）
- 填 "initial commit" → Commit

**命令行方式**：
```bash
cd levant-briefing-site
git init
git add .
git commit -m "initial: setup with W13-14 and W15-16"
git branch -M main
git remote add origin https://github.com/<你的用户名>/levant-ict-briefing.git
git push -u origin main
```

### Step 3. 授权 GitHub Actions 写权限

- 仓库页 → **Settings** → **Actions** → **General**
- 滚到底部 "Workflow permissions"
- 选 ✅ **Read and write permissions**
- 点 **Save**

（这步不做的话 Actions 无法自动 push 更新 `index.html`）

### Step 4. Cloudflare Pages 连接

- https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- 授权 Cloudflare 访问你的 GitHub（选 **Only select repositories** → 只勾此仓库）
- 选仓库 → **Begin setup**
- 构建设置:
  - Framework preset: **None**
  - Build command: **（留空）**
  - Build output directory: **`/`**
- **Save and Deploy**
- 1-2 分钟后得到 URL: `https://levant-ict-briefing.pages.dev`

### Step 5. Cloudflare Access 邮箱白名单

- Cloudflare Dashboard → **Zero Trust**（首次需注册团队，免费）
- 团队名: 如 `huawei-mssd-iraq`
- 进入 Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**
- 配置:
  - Application name: `Levant Briefing`
  - Session Duration: `24 hours`
  - Application domain: `levant-ict-briefing.pages.dev`
- 创建 Policy:
  - Name: `Huawei staff only`
  - Action: **Allow**
  - Include: **Emails ending in** → `@huawei.com`
  - （如需：Add include → Emails → 具体个人邮箱）
- **Save**

### Step 6. 测试

- 匿名窗口打开 https://levant-ict-briefing.pages.dev
- 应该弹出 Cloudflare 登录，输入华为邮箱 → 收验证码 → 通过后访问 H5
- ✅ 完成

---

## 🤖 自动化细节

### auto-index.yml

**触发**: 有人 push 修改到 `issues/**`

**行为**:
1. Checkout 代码
2. 运行 `scripts/rebuild_index.py` → 扫描 issues/ 目录 → 生成 `index.html`
3. 如果 `index.html` 有变化，自动 commit 并 push

**结果**: 你只管上传新期 HTML，首页自动同步

### biweekly-reminder.yml

**触发**: `cron: '0 5 * * 1'`（每周一 UTC 05:00 = 巴格达 08:00）

**行为**:
1. 运行 `scripts/check_issue_due.py`
2. 计算最新期的结束周 + 1 周 = 下期预期开始日
3. 如果该日期已过（说明该出新期但没出），在仓库创建 GitHub Issue 提醒

**结果**: 你到期会收到 GitHub 邮件通知

---

## 🔧 命名规则

**文件名**: `wN-N+1.html`
- `w15-16.html` ✅
- `w17-18.html` ✅
- `w5-6.html` ✅ (个位数周不需要补零)
- ❌ `week-15-16.html`（脚本不识别）
- ❌ `W15-16.html`（大小写敏感）

**内容要求**:
- 必须有 `<title>` 标签
- 必须有 `<div class="retro-item retro-current">` 结构（脚本从中提取本期标题）
- 跨期跳转用 `location.href='wM-N.html'` 相对路径

只要是跟 Claude 用这个 skill 生成的 HTML，以上都自动满足。

---

## 🆘 故障排查

### index.html 没更新
1. 检查 仓库 → **Actions** 标签 → 看最近的 "Auto rebuild index" 是否成功
2. 如果失败，点进去看日志
3. 最常见原因: **Step 3 未配置写权限**

### Cloudflare Pages 没部署
1. Cloudflare Dashboard → 对应 Pages 项目 → **Deployments**
2. 看是否有 "Failed" 状态
3. 构建日志会提示具体原因（通常是路径错误）

### 新期上传后找不到
1. 确认文件名符合 `wN-N.html` 规则
2. 确认文件在 `issues/` 目录下，而不是根目录
3. 浏览器 Ctrl+F5 强刷（CDN 缓存）

---

## 📞 问题联系

技术问题: **吴昊 679001**

## 📜 版权

© 2026 华为伊拉克代表处 MSSD · 仅供内部参考 · 请勿外传
