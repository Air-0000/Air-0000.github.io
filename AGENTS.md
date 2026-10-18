# 网站维护约定

这是刘正阳的个人研究与工程主页，生产站点为 https://zyliu.pages.dev/。

## 源码与命令

- `public/` 是唯一发布源；根目录同名页面、样式、脚本和资源是本地镜像，不纳入 Git。
- `npm ci` 安装锁定版本依赖；站点本身没有构建步骤和运行时框架。
- `npm run preview` 启动本地预览（默认 http://127.0.0.1:18542）。
- `npm run check` 检查 JavaScript 语法、静态资源和内部锚点。
- 修改 CSS/JS 后更新三张 HTML 中的资源哈希查询参数，执行 `npm run sync` 同步镜像。
- 页面修改后检查桌面和手机布局；涉及主题、筛选或导航时检查对应交互。
- 只在用户要求发布时执行 `npm run deploy`，目标是既有 Cloudflare Pages 项目 `zyliu` 的 `main` 分支。
- 与 Cloudflare 交互时，除项目存在 Wrangler 配置的情况外使用 cf CLI。本工程保留 Wrangler 配置和既有 Pages 发布命令。
- GitHub 默认分支为 `main`；提交并推送维护源码不等于已经发布网站。
- 免费 GitHub Pages 地址为 https://air-0000.github.io/，公开发布库为 `Air-0000/Air-0000.github.io`。
- 用户要求发布到 GitHub Pages 时，先提交 public 改动，再执行 `npm run deploy:github`，只发布 public 静态文件，不向发布分支上传 public 之外的文件。
- GitHub Pages 使用 gh-pages 根目录的分支构建，无需自定义 workflow；Cloudflare 继续使用原部署命令。

## 内容真实性

- 区分 CoopTrack 原始开源框架与个人扩展；归档滤波评测不是融合模块受控消融。
- AP 与 Precision 不混用；展示收益时同时保留召回损失和评测范围。
- OnSite：2026 全国第 8，队长，全部方案与代码独立完成（本人确认）。
- MathorCup：2026 A 题校内评比一等奖、校内唯一；非正式赛事奖项。个人负责程序设计与代码实现。
- Nili 使用普通 llama.cpp Web UI，不声称已有自研专属界面；流程图是示意。
- OnSite 路网图来自真实车道输入坐标，不是运行回放；几百辆车的全景不自动构成有效展示。
- 不编造演示、实验、简历、奖项证明或完成状态。未经提供或验证的素材不要补写成已完成成果。
- `public/evidence/` 只保留可公开的白名单指标和来源摘要；不得上传个人聊天、私有记忆、凭据、登录缓存或原始诊断隐私文本。

## GitHub 与凭据

- 统一仓库：`Air-0000/Air-0000.github.io`（公开）。`main` 保存维护源码，`gh-pages` 只保存已发布的静态文件。
- `npm run deploy:github` 检查并发布已提交的 public 内容到 gh-pages，GitHub Pages 从 gh-pages 根目录自动构建。
- `npm run setup` 安装仓库级 pre-push 检查；源码 push 到 main 不会自动改变网站。
- 不提交 node_modules、.wrangler、.env、.dev.vars、私人对话、登录凭据或机器专属数据。
- Cloudflare 登录只留在本机。网站只发布 public；维护说明和脚本不进入 gh-pages。
