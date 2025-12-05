from __future__ import annotations

from typing import Any

import httpx

from app.core.config import get_settings
from app.schemas.tryon import TryOnPayload, TryOnResponse


class DiffusionClient:
    """Light wrapper around the python diffusion micro-service."""

    def __init__(self, base_url: str | None = None, *, timeout: float = 60.0) -> None:
        settings = get_settings()
        self.base_url = base_url or settings.diffusion_service_url
        self._timeout = timeout

    async def generate(self, payload: TryOnPayload) -> TryOnResponse:
        # NOTE: This is a placeholder. Replace with actual inference logic or SDK call.
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            try:
                response = await client.post(self.base_url, json=payload.model_dump())
                response.raise_for_status()
                data: dict[str, Any] = response.json()
            except httpx.HTTPError as exc:
                raise RuntimeError(f"Diffusion service error: {exc}") from exc

        return TryOnResponse(**data)
