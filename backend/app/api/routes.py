from fastapi import APIRouter

from app.api.tryon import router as tryon_router

api_router = APIRouter()
api_router.include_router(tryon_router, prefix="/try-on", tags=["try-on"])
