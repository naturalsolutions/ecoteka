from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    contacts,
    forgot_password_link,
    login,
    users,
    utils,
    register,
    registration_link,
    geo_files,
    trees,
    maps,
    taxref
)

api_router = APIRouter()
api_router.include_router(
    login.router,
    prefix="/auth",
    tags=["auth"]
)
api_router.include_router(
    register.router,
    prefix="/auth",
    tags=["auth"]
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
    forgot_password_link.router,
    prefix='/forgot-password',
    tags=["forgot-password"]
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
api_router.include_router(
    geo_files.router,
    prefix="/geo_files",
    tags=["geo_files"]
)
api_router.include_router(
    trees.router,
    prefix="/trees",
    tags=["trees"]
)
api_router.include_router(
    maps.router,
    prefix="/maps",
    tags=["maps"]
)

api_router.include_router(
    taxref.router,
    prefix="/taxref",
    tags=["taxref"]
)
