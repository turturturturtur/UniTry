# UniTry Backend

FastAPI 服务，为智能换衣 diffusion 模型提供 API 网关。

## 快速开始

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

默认监听 `http://127.0.0.1:8000`，主要接口：

| 方法 | 路径                | 说明           |
| ---- | ------------------- | -------------- |
| GET  | `/api/try-on/health` | 服务健康检查   |
| POST | `/api/try-on/`       | 触发 AI 换装   |

## 测试

```bash
cd backend
pytest
```

# Diffusion model api interface
Working on. 代码文件在 `model/` 中, 目前文生图能正常使用, 图生图效果很差.
- model/liblib.py: 使用 [LiblibAI](https://www.liblib.art/), 创建 .env 文件, 写入
```sh
ACCESS_KEY=xxx
SECRET_KEY=xxx # 从liblib获取
```
试运行
```py
python model/liblib.py -m text
```