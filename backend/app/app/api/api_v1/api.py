from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    admin,
    auth,
    geo_files,
    health_assessment,
    intervention,
    maps,
    organization,
    registration_link,
    taxref,
    trees,
    users,
    featured,
    ws
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(featured.router, prefix="/featured", tags=["featured"])
api_router.include_router(
    registration_link.router,
    prefix="/registration_link",
    tags=["registration_link"],
)
api_router.include_router(
    geo_files.router,
    prefix="/organization/{organization_id}/geo_files",
    tags=["geo_files"],
)
api_router.include_router(
    health_assessment.router, prefix="/organization/{organization_id}/trees/{tree_id}/health_assessments", tags=["health_assessments"]
)
api_router.include_router(
    trees.router, prefix="/organization/{organization_id}/trees", tags=["trees"]
)
api_router.include_router(maps.router, prefix="/maps", tags=["maps"])

api_router.include_router(taxref.router, prefix="/taxref", tags=["taxref"])

api_router.include_router(
    intervention.router,
    prefix="/organization/{organization_id}/interventions",
    tags=["interventions"],
)

api_router.include_router(
    organization.router, prefix="/organization", tags=["organization"]
)

api_router.include_router(
    ws.router, tags=["ws"]
)
