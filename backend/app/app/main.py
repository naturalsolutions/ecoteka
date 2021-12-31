from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi_jwt_auth.exceptions import AuthJWTException

from app.core import authjwt_exception_handler, settings
from app.core.middleware.channel_event_middleware import ChannelEventMiddleware
from app.api.api_v1.api import api_router

from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache

from starlette.requests import Request
from starlette.responses import Response



app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.ROOT_PATH,
    exception_handlers={AuthJWTException: authjwt_exception_handler},
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.add_middleware(ChannelEventMiddleware)
app.include_router(api_router)

@app.on_event("startup")
async def startup():
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")