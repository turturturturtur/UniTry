from datetime import datetime
from typing import Literal

from pydantic import BaseModel, HttpUrl


class TryOnPayload(BaseModel):
    model_image_url: HttpUrl
    garment_image_url: HttpUrl
    prompt: str
    negative_prompt: str | None = None
    scheduler: Literal["ddim", "dpmpp", "heun"] = "dpmpp"


class TryOnResponse(BaseModel):
    request_id: str
    image_url: HttpUrl
    inference_seconds: float
    created_at: datetime
