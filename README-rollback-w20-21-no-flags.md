# Rollback to W20-21 only · No flag emoji version

本包用于：
1. 删除 / 不再展示 W21-22；
2. 只保留 W20-21 作为最新简报；
3. 删除页面中的国旗 emoji，避免老浏览器显示异常；
4. `/latest` 与 `/w21-22.html` 都跳转到 `/w20-21.html`。

## 覆盖文件

把以下文件复制到 GitHub 仓库根目录：

- index.html
- w20-21.html
- _redirects
- netlify.toml

## 删除 W21-22

在仓库根目录执行：

```bash
bash cleanup-w21-22.sh
```

或者手动执行：

```bash
git rm -f w21-22.html w21-22-*.md
git rm -f w22-23.html w22-23-*.md
```

## 提交

```bash
git add index.html w20-21.html _redirects netlify.toml cleanup-w21-22.sh
git commit -m "Rollback to W20-21 and remove flag emojis"
git push
```

## 测试

- /
- /latest
- /w20-21.html
- /w21-22.html  应跳转到 /w20-21.html
