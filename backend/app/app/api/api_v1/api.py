from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users, utils, contacts, geo_files, trees

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(geo_files.router, prefix="/geo_files", tags=["geo_files"])
api_router.include_router(trees.router, prefix="/trees", tags=["trees"])
