from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    contacts,
    login,
    users,
    utils,
    registration_link
)

api_router = APIRouter()
api_router.include_router(
    login.router,
    tags=["login"]
)
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)
api_router.include_router(
    utils.router,
    prefix="/utils",
    tags=["utils"]
)
api_router.include_router(
    contacts.router,
    prefix="/contacts",
    tags=["contacts"]
)
api_router.include_router(
    registration_link.router,
    prefix="/registration_link",
    tags=["registration_link"]
)
