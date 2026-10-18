# 刘正阳 · 个人主页

- 网站：[zyliu.pages.dev](https://zyliu.pages.dev/) · [air-0000.github.io](https://air-0000.github.io/)
- 本仓库统一保存维护源码和发布文件；`main` 为源码，`gh-pages` 为 GitHub Pages 发布分支。
- `public/` 是网站唯一编辑源，原生 HTML/CSS/JavaScript，无构建步骤。根目录镜像由 `npm run sync` 生成，不提交。

## 使用 Codex 维护

在 Codex 中打开本仓库，先读 `AGENTS.md`。修改 public 后检查和预览，提交到 main，再按需要发布。

```bash
git clone https://github.com/Air-0000/Air-0000.github.io.git
cd Air-0000.github.io
npm ci
npm run setup
npm run check
npm run preview  # http://127.0.0.1:18542
```

```bash
git add public
git commit -m "Update portfolio"
git push
npm run deploy:github  # 更新 github.io
npm run deploy         # 更新原 Cloudflare Pages 项目 zyliu
```

部署使用现有本机 GitHub/Cloudflare 登录，不将凭据写入仓库。GitHub Pages 从 gh-pages 根目录发布，无需自定义 Actions workflow。

## 文件

- public/index.html：研究、代表工程、经历和联系入口。
- public/projects.html：14 个项目的独立索引。
- public/evidence.html 与 evidence/：公开来源、指标和验证范围。
- public/assets/：网站图像与路网图。
- scripts/：静态检查和发布命令；.githooks/：推送前检查。

项目与奖项事实、图示范围等约束见 AGENTS.md。
