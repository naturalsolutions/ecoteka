import json
import os
import uuid
import fiona
import numpy as np
from typing import Any, List, Optional, Dict, Union
import geopandas as gpd
from shapely.geometry import shape
from shapely.geometry.geo import mapping
from shapely.geometry.multipolygon import MultiPolygon
from geoalchemy2.shape import to_shape
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.api import get_db
from app import crud
from app.core import settings, authorization, permissive_authorization, get_current_user, get_optional_current_active_user
from app.api.deps import get_enforcer

from app.crud import organization, user
from app.schemas import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationMetrics,
    Coordinate,
)
from app.models import User, Organization as OrganizationModel


router = APIRouter()

settings.policies["organizations"] = {
    "organizations:get_one": ["guest", "owner", "manager", "contributor", "reader"],
    "organizations:update": ["owner", "manager"],
    "organizations:get_geojson": ["owner", "manager", "contributor", "reader"],
    "organizations:get_path": ["owner", "manager", "contributor", "reader"],
    "organization:get_center_from_organization": [
        "owner",
        "manager",
        "contributor",
        "reader",
    ],
    "organizations:upload_working_area": ["owner", "manager"],
    "organizations:get_working_area": [
        "owner",
        "manager",
        "contributor",
        "reader",
    ],
    "organizations:get_metrics": [
        "owner",
        "manager",
        "contributor",
        "reader"
    ]
}


@router.post("", response_model=Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    enforcer = Depends(get_enforcer)
):
    new_organization = organization.create(db, obj_in=organization_in).to_schema()
    enforcer.add_role_for_user_in_domain(
        str(current_user.id), "owner", str(new_organization.id)
    )
    enforcer.load_policy()

    return new_organization


@router.patch("/{organization_id}", 
    response_model=Organization, 
    dependencies=[Depends(authorization("organizations:update"))]
)
def update_organization(
    organization_id: int,
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationUpdate,
) -> Optional[OrganizationModel]:
    org = organization.get(db, id=organization_id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    organization_in_db =  organization.update(
        db,
        db_obj=org,
        obj_in=jsonable_encoder(organization_in, exclude_unset=True),
    )

    return organization_in_db.to_schema()

@router.get(
    "/{organization_id}", 
    response_model=Organization,
    dependencies=[Depends(permissive_authorization("organizations:get_one"))]
)
def get_one(
    organization_id: Union[str, int],
    *,
    current_user: User = Depends(get_optional_current_active_user),
    db: Session = Depends(get_db),
    enforcer = Depends(get_enforcer)
) -> Optional[Organization]:
    """
    get one organization by id
    """
    organization_in_db = crud.organization.get_by_id_or_slug(db, id=organization_id)
    
    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    organization = organization_in_db.to_schema()

    if current_user:
        current_roles = enforcer.get_roles_for_user_in_domain(str(current_user.id), str(organization_in_db.id))
        if len(current_roles) > 0:
            organization.current_user_role = current_roles[0]
        if current_user.is_superuser:
            organization.current_user_role = 'admin'

    return organization


#@router.get("/{organization_id}/path", response_model=List[Organization])
#def get_path(
#    organization_id: int,
#    auth=Depends(authorization("organizations:get_path")),
#    *,
#    db: Session = Depends(get_db),
#    current_user: User = Depends(get_current_user),
#):
#    return [org.to_schema() for org in organization.get_path(db, id=organization_id)]


@router.get(
    "/{organization_id}/get-centroid-organization", 
    response_model=Coordinate,
    dependencies=[Depends(authorization("organization:get_center_from_organization"))]
)
def get_center_from_organization(
    *,
    db: Session = Depends(get_db),
    organization_id: int,
) -> Any:
    """
    find centroid of Organization
    """
    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_id}"
    df = gpd.read_postgis(sql, db.bind)

    X = df.geom.apply(lambda p: p.x)
    Y = df.geom.apply(lambda p: p.y)
    xCenter = np.sum(X) / len(X)
    yCenter = np.sum(Y) / len(Y)

    coordinate = Coordinate(
        longitude=xCenter,
        latitude=yCenter,
    )

    return coordinate


# @router.post("/{organization_id}/working_area", response_model=Organization)
# async def upload_working_area(
#     file: UploadFile = File(...),
#     *,
#     organization_id: int,
#     auth=Depends(authorization("organizations:upload_working_area")),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """
#     Upload a geo file
#     """
#     try:
#         filename_parts = os.path.splitext(file.filename)
#         extension = filename_parts[1][1:]

#         if extension not in ["geojson"]:
#             raise HTTPException(status_code=415, detail="File format unsupported")

#         unique_name = uuid.uuid4()
#         unique_filename = f"{unique_name}.{extension}"
#         copy_filename = f"{settings.UPLOADED_FILES_FOLDER}/{unique_filename}"
#         copy_file = await file.read()

#         with open(copy_filename, "wb") as f:
#             f.write(copy_file)  # type: ignore

#         c = fiona.open(copy_filename)
#         record = next(iter(c))

#         if not record["geometry"]["type"]:
#             raise HTTPException(status_code=415, detail="File unsupported")

#         organization_in_db = organization.get(db, id=organization_id)

#         if not organization_in_db:
#             raise HTTPException(status_code=404, detail="Organization not found")

#         shape_working_area = shape(record["geometry"])
#         working_area = shape_working_area.wkt

#         if record["geometry"]["type"] == "Polygon":
#             working_area = MultiPolygon([shape_working_area]).wkt

#         return organization.update(
#             db,
#             db_obj=organization_in_db,
#             obj_in={"working_area": working_area},
#         ).to_schema()

#     finally:
#         os.remove(copy_filename)
#         await file.close()


# @router.get("/{organization_id}/working_area")
# def get_working_area(
#     *,
#     organization_id: int,
#     auth=Depends(authorization("organizations:get_working_area")),
#     db: Session = Depends(get_db),
# ) -> Any:
#     """
#     get working_area geojson from one organization
#     """
#     organization_in_db = organization.get(db, id=organization_id)

#     if not organization_in_db:
#         raise HTTPException(status_code=404, detail="Organization not found")

#     if organization_in_db.working_area is None:
#         raise HTTPException(
#             status_code=404, detail="Organization working area is empty"
#         )

#     shape = to_shape(organization_in_db.working_area)

#     return {"type": "Feature", "geometry": mapping(shape), "properties": {}}

@router.get(
    "/{organization_id}/metrics_by_year/{year}", 
    response_model=OrganizationMetrics,
    dependencies=[Depends(authorization("organizations:get_metrics"))])
def get_metrics_by_year(
    *,
    organization_id: int,
    year: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    get dashboard metrics from one organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    trees_count = organization_in_db.total_trees
    # Asked in specs but no corresponding intervention_type
    planted_trees_count = len([])
    logged_trees_count = len(crud.intervention.get_by_intervention_type_and_year(db, organization_id=organization_id, intervention_type="felling", year=year))
    scheduled_cost = 0
    scheduled_interventions = crud.intervention.get_scheduled_by_year(db, organization_id=organization_id, year=year)
    for i in scheduled_interventions:
        scheduled_cost += i.estimated_cost
    planned_cost = 0  
    planned_interventions = crud.intervention.get_planned_by_year(db, organization_id=organization_id, year=year)
    for i in planned_interventions:
        planned_cost += i.estimated_cost

    metrics = OrganizationMetrics(
        total_tree_count=trees_count,
        logged_trees_count=logged_trees_count,
        planted_trees_count=planted_trees_count,
        planned_interventions_cost=planned_cost,
        scheduled_interventions_cost=scheduled_cost,
        )


    return metrics
