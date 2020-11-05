from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    contacts,
    geo_files,
    login,
    maps,
    organization,
    register,
    registration_link,
    taxref,
    trees,
    maps,
    taxref,
    intervention,
    users,
    utils,
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

api_router.include_router(
    intervention.router,
    prefix='/interventions',
    tags=['interventions']
)

api_router.include_router(
    organization.router,
    prefix="/organization",
    tags=["organization"]
)
