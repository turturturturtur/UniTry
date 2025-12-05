# UniTry 架构与文件说明

本文件帮助你快速理解智能换衣原型项目的目录结构、关键文件职责以及所用框架的工作方式，方便日后扩展到 Diffusion 推理、移动端封装等场景。

## 1. 顶层目录概览

| 路径 | 职责 | 运行方式 |
| --- | --- | --- |
| `package.json` | Monorepo 级别脚本，提供 `frontend:*`、`backend:*` 命令，统一管理前后端启动方式。 | `npm run frontend:dev`、`npm run backend:dev` |
| `README.md` | 快速上手说明，列出依赖、启动命令与联调提示。 | `cat README.md` |
| `ARCHITECTURE.md` | （当前文件）详细记录模块划分、运行机制与框架知识。 | - |
| `.gitignore` | 忽略 node_modules、虚拟环境、编译产物。 | Git 自动生效 |
| `frontend/` | Next.js App Router 前端，包含 UI、路由、Tailwind 配置。 | `cd frontend && npm install && npm run dev` |
| `backend/` | FastAPI 后端，提供 REST API、Diffusion 占位客户端、pytest 用例。 | `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload` |

## 2. 前端模块（`frontend/`）

| 路径 | 作用 |
| --- | --- |
| `package.json` | 定义 Next.js、React 等依赖与 `dev/build/start/lint` 脚本。 |
| `tsconfig.json` | TypeScript 配置，启用 `strict`、`paths` 等选项，支持 `@/*` 别名。 |
| `tailwind.config.js` | Tailwind 扫描范围、品牌色扩展（`brand`），方便统一主题。 |
| `postcss.config.js` | Tailwind + Autoprefixer 插件链。 |
| `next.config.mjs` | Next.js 全局配置（`reactStrictMode`）。 |
| `app/layout.tsx` | App Router 根布局，引入 Google 字体、暗色背景。 |
| `app/globals.css` | Tailwind 基础层 + 自定义 `glass-panel` 等工具类。 |
| `app/page.tsx` | 主页：Hero、上传控件 Demo、Feature 卡片、Roadmap，集中体现产品愿景。 |
| `components/` | 预留的共享 UI 组件目录，目前为空，方便后续拆分表单/卡片。 |
| `public/` | 静态资源目录，可放置 LOGO、占位图片等。 |

**运行流程**：
1. `next dev` 启动开发服务器，读取 `app/...` 作为路由入口。
2. Tailwind 通过 `globals.css` 注入基础样式，`page.tsx` 使用 React 组件声明 UI。
3. 未来若要与后端通信，可在 `UploadForm` 里调用 `fetch(process.env.NEXT_PUBLIC_API_BASE + "/try-on")` 并展示推理结果。

## 3. 后端模块（`backend/`）

| 路径 | 作用 |
| --- | --- |
| `pyproject.toml` | Python 包与构建配置，声明 FastAPI、httpx、pydantic-settings 依赖。 |
| `requirements.txt` | 运行/开发所需依赖清单，方便 `pip install -r`. |
| `README.md` | 虚拟环境、安装依赖、启动 Uvicorn、测试命令说明。 |
| `app/main.py` | FastAPI 入口，注册 CORS、中间件与 `/api` 路由。 |
| `app/api/routes.py` | 汇总各业务路由，当前挂载 `tryon` 模块。 |
| `app/api/tryon.py` | 定义 `GET /api/try-on/health` 与 `POST /api/try-on/`，通过依赖注入获取 `DiffusionClient`。 |
| `app/core/config.py` | Pydantic Settings，集中管理项目名称、API 前缀、Diffusion 服务地址，可通过 `.env` 覆盖。 |
| `app/services/diffusion.py` | httpx 异步客户端，占位调用外部 Python Diffusion 微服务，未来可替换为 SDK 或 MQ。 |
| `app/schemas/tryon.py` | 请求/响应数据模型（URL、Prompt、推理耗时等）。 |
| `tests/test_health.py` | pytest 用例，验证健康检查接口返回 `{"status": "ok"}`。 |

**运行流程**：
1. `uvicorn app.main:app --reload` 启动服务，会读取 `.env`（若存在）加载配置。
2. 前端或其他客户端向 `POST /api/try-on/` 发送 `TryOnPayload`。
3. `DiffusionClient.generate` 负责将请求转发给实际的 Diffusion 推理服务，解析响应为 `TryOnResponse` 返回。
4. 若要改用内部 Python 模型，可把 httpx 调用替换成直接调用 Stable Diffusion、ControlNet 等推理代码。

## 4. 端到端工作流

1. **素材上传**：Next.js 前端让用户选择模特照、服装图与风格提示（当前为占位交互）。
2. **API 调用**：表单提交后将参数发送至 FastAPI `/api/try-on/`。
3. **Diffusion 推理**：后端通过 `DiffusionClient` 调用你的 Python Diffusion 服务（可部署在 GPU 服务器或第三方平台）。
4. **结果返回/展示**: 返回的 `image_url`、耗时等字段在前端渲染，即可实现换装预览。
5. **多端扩展**：因前端使用 React/Next.js，后续可通过 React Native、Capacitor 或 WebView 包装进 Android/iOS 客户端；后端用标准 REST，可供任何平台调用。

## 5. 框架知识速览

### Next.js（前端框架）
- 基于 React 的全栈框架，支持 SSR、SSG、增量静态生成。
- App Router（`app/` 目录）将文件系统映射为路由，并支持服务端组件、流式渲染。
- 内置 `next/font` 动态加载字体、`Image` 优化等特性。

### React
- 组件化 UI 库，采用声明式渲染。当前项目主要使用函数组件与 `useState` 处理上传表单状态。
- 可通过 hooks（`useEffect`, `useTransition` 等）扩展到更复杂的交互。

### Tailwind CSS
- 原子化 CSS 框架，使用类名快速组合样式，减少自定义 CSS。
- `tailwind.config.js` 可扩展颜色、字体、阴影等主题变量。
- 与 Next.js 结合时，Tailwind CLI 会扫描 `app/**/*.tsx` 生成按需样式，输出到 `globals.css`。

### FastAPI
- 基于 Starlette + Pydantic 的高性能 Python Web 框架，类型注解即文档。
- 自动生成 OpenAPI/Swagger 文档（访问 `/docs`），便于前后端协作。
- 支持依赖注入，本项目通过 `Depends(get_diffusion_client)` 管理服务实例。

### Pydantic & pydantic-settings
- `TryOnPayload`、`TryOnResponse` 使用 Pydantic 校验输入输出，确保 URL、枚举等合法。
- `Settings` 类从环境变量或 `.env` 中读取配置，便于区分开发/生产环境。

### httpx & Uvicorn
- `httpx.AsyncClient` 用于发起异步 HTTP 调用，可方便地切换到 WebSocket、Retry 等功能。
- `uvicorn` 是 ASGI 服务器，FastAPI 在其上运行，支持热重载与多 Worker。

## 6. 扩展建议

1. **联调 Diffusion**：在后端替换 `DiffusionClient.generate` 为真实模型推理逻辑，并在前端表单中调用接口。
2. **鉴权与配额**：结合 FastAPI 的依赖系统实现 API key / OAuth，保护 GPU 资源。
3. **队列 & 任务系统**：当推理耗时较长时，可使用 Celery、RQ 或自建消息队列异步执行，并通过 WebSocket 推送结果。
4. **移动端打包**：利用 Expo Router 或 Capacitor 将 Next.js UI 复用到移动端；后端保持 REST API，配合对象存储返回图片链接。

通过该文档，你可以清楚每个文件的位置和作用，并了解 Next.js + Tailwind + FastAPI + Pydantic 的基本概念，从而自如地扩展 UniTry 智能换衣项目。
