from fastapi import APIRouter, Depends

from app.schemas.tryon import TryOnPayload, TryOnResponse
from app.services.diffusion import DiffusionClient

router = APIRouter()


def get_diffusion_client() -> DiffusionClient:
    return DiffusionClient()


@router.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/", response_model=TryOnResponse, summary="触发AI换装推理")
async def trigger_try_on(
    payload: TryOnPayload, client: DiffusionClient = Depends(get_diffusion_client)
) -> TryOnResponse:
    return await client.generate(payload)
