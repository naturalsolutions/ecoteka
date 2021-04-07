from pathlib import Path
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from fastapi_jwt_auth.exceptions import AuthJWTException

from app.core import authjwt_exception_handler, settings, get_current_user
from app.core.middleware.channel_event_middleware import ChannelEventMiddleware
from app.api.api_v1.api import api_router

from app.db.base import Base 

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.ROOT_PATH,
    exception_handlers={AuthJWTException: authjwt_exception_handler},
    dependencies=[Depends(get_current_user)]
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
