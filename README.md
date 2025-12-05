# UniTry · 智能换衣原型

基于 Next.js + Tailwind CSS 的前端，以及 FastAPI 后端，为未来接入 diffusion 推理服务做准备。

## 目录结构

```
UniTry
├─ frontend/   # Next.js App Router，适配多端
└─ backend/    # FastAPI，可连接 Python diffusion 服务
```

## 准备工作

1. 安装 Node.js 18+ 与 Python 3.10+。
2. 克隆代码后分别安装前后端依赖。

### 前端

```bash
cd frontend
npm install
npm run dev
```

默认访问 `http://localhost:3000`，页面包含上传表单、功能亮点与路线图，后续可直接连接后端 API。

### 后端

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

默认访问 `http://127.0.0.1:8000`，核心接口：

- `GET /api/try-on/health`：健康检查
- `POST /api/try-on/`：触发 diffusion 换装（目前为占位逻辑，待接入真实模型）

## 联调

前端在 `.env.local` 中配置 `NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api` 后，即可将上传表单与后端联通。后端通过 `app/services/diffusion.py` 内的 `DiffusionClient` 与实际 Python 推理服务通信，支持切换到 GPU 集群或第三方推理接口。
