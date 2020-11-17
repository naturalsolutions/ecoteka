from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi_jwt_auth.exceptions import AuthJWTException
from app.core import (
    authjwt_exception_handler,
    settings
)
from app.api.api_v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.ROOT_PATH,
    exception_handlers={
        AuthJWTException: authjwt_exception_handler
    }
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
