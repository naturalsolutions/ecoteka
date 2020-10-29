from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.api_v1.api import api_router
from app.core import (
    settings
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.ROOT_PATH
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin) for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)
