import json
import logging
import os
import uuid
import fiona
import numpy as np
from typing import Any, List, Optional
import geopandas as gpd
from shapely.geometry import shape
from shapely.geometry.geo import mapping
from shapely.geometry.multipolygon import MultiPolygon
from geoalchemy2.shape import to_shape
from passlib import pwd
from fastapi import APIRouter, Body, Depends, HTTPException, File, UploadFile
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.api import get_db
from app import crud
from app.core import (
    settings,
    enforcer,
    set_policies,
    authorization,
    get_current_user,
    get_current_active_user,
)
from app.crud import organization, user
from app.schemas import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
    Coordinate,
    UserOut,
    UserInvite,
    UserCreate,
)
from app.models import User


router = APIRouter()

policies = {
    "organizations:get_one": ["owner", "manager", "contributor", "reader"],
    "organizations:get_teams": ["owner", "manager", "contributor", "reader"],
    "organizations:get_members": ["owner", "manager", "contributor", "reader"],
    "organizations:add_members": ["owner", "manager"],
    "organizations:remove_member": ["owner", "manager"],
    "organizations:update": ["owner"],
    "organizations:edit_member": ["owner", "manager"],
    "organizations:get_geojson": ["owner", "manager", "contributor", "reader"],
    "organizations:get_path": ["owner", "manager", "contributor", "reader"],
    "organization:get_center_from_organization": [
        "owner",
        "manager",
        "contributor",
        "reader",
    ],
    "organizations:upload_working_area": ["owner"],
    "organizations:get_working_area": [
        "owner",
        "manager",
        "contributor",
        "reader",
    ],
}
set_policies(policies)


@router.post("/", response_model=Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
):
    new_organization = organization.create(
        db, obj_in=organization_in
    ).to_schema()
    enforcer.add_role_for_user_in_domain(
        str(current_user.id), "owner", str(new_organization.id)
    )
    enforcer.load_policy()

    return new_organization


@router.patch("/{organization_id}", response_model=Organization)
def update_organization(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:update")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    organization_in: OrganizationUpdate,
):
    org = organization.get(db, id=organization_id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return organization.update(
        db,
        db_obj=org,
        obj_in=jsonable_encoder(organization_in, exclude_unset=True),
    )


@router.get("/{organization_id}")
def get_one(
    *,
    auth=Depends(authorization("organizations:get_one")),
    organization_id: int,
    db: Session = Depends(get_db),
) -> Optional[Organization]:
    """
    get one organization by id
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    total_trees = organization.get_total_tree_by_id(db, id=organization_id)

    if not total_trees:
        total_trees = 0

    organization_response = Organization(
        **jsonable_encoder(
            organization_in_db.to_schema(), exclude=["total_trees"]
        ),
        total_trees=total_trees,
    )

    return organization_response


@router.get("/{organization_id}/teams", response_model=List[Organization])
def get_teams(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:get_teams")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        org.to_schema()
        for org in organization.get_teams(db, parent_id=organization_id)
    ]



@router.get("/{organization_id}/members")
def get_members(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:get_members")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.organization.get_members(db, id=organization_id)

@router.post("/{organization_id}/members")
def add_members(
    organization_id: int,
    *,
    invites: List[UserInvite] = Body(...),
    auth=Depends(authorization("organizations:add_members")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        members = crud.organization.get_members(db, id=organization_id)
        
        users_to_add = (
            invite
            for invite in invites
            if invite.email not in (u.get("email") for u in members)
        )

        for invite in users_to_add:
            user_in_db = user.get_by_email(db, email=invite.email)

            if not user_in_db:
                user_in_db = user.create(
                    db,
                    obj_in=UserCreate(
                        full_name=invite.email,
                        email=invite.email,
                        password=pwd.genword(),
                    ),
                )
            enforcer.add_role_for_user_in_domain(
                str(user_in_db.id),
                invite.role if invite.role else "guest",
                str(organization_id),
            )
            enforcer.load_policy()

        return [
            user
            for user in get_members(
                organization_id, auth=auth, db=db, current_user=current_user
            )
            if user.get("email") in (invite.email for invite in invites)
        ]
    except Exception as e:
        logging.error(e)


@router.delete("/{organization_id}/members/{user_id}")
def remove_member(
    organization_id: int,
    user_id: int,
    *,
    auth=Depends(authorization("organizations:remove_member")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_in_db = user.get(db, id=user_id)

    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")

    current_roles = enforcer.get_roles_for_user_in_domain(
        str(user_id), str(organization_id)
    )

    for current_role in current_roles:
        enforcer.delete_roles_for_user_in_domain(
            str(user_id), current_role, str(organization_id)
        )

    return True


@router.patch("/{organization_id}/members/{user_id}/role")
def update_member_role(
    organization_id: int,
    user_id: int,
    *,
    role: str = Body(...),
    auth=Depends(authorization("organizations:edit_member")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    roles_order = ["owner", "manager", "contributor", "reader"]

    if role not in roles_order:
        raise HTTPException(
            status_code=400, detail=f"This role : {role} does not exist"
        )

    user_in_db = user.get(db, id=user_id)

    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert to sqlalchemy obj to UserOut schema for hidding password
    user_in_db = UserOut(**user_in_db.as_dict())

    current_user_roles = enforcer.get_roles_for_user_in_domain(
        str(current_user.id), str(organization_id)
    )

    if len(current_user_roles) > 0:
        current_user_role = current_user_roles[0]

    if roles_order.index(current_user_role) > roles_order.index(role):
        raise HTTPException(
            status_code=403, detail="You can only set roles below yours"
        )

    user_roles = enforcer.get_roles_for_user_in_domain(
        str(user_id), str(organization_id)
    )

    # Role exist for this user (it's a patch)
    if len(user_roles) > 0:
        user_role = user_roles[0]
        if roles_order.index(current_user_role) > roles_order.index(user_role):
            raise HTTPException(
                status_code=403, detail="You can't edit a role above yours"
            )

        enforcer.delete_roles_for_user_in_domain(
            str(user_id), user_role, str(organization_id)
        )
        enforcer.add_role_for_user_in_domain(
            str(user_id), role, str(organization_id)
        )
        # need ro reload handle new policy
        enforcer.load_policy()

    return dict(user_in_db, role=role)


@router.get("{organization_id}/geojson")
def get_geojson(
    *,
    organization_id: int,
    auth=Depends(authorization("organizations:get_geojson")),
    db: Session = Depends(get_db),
) -> Any:
    """
    generate geojson from organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_in_db.id}"
    df = gpd.read_postgis(sql, db.bind)
    data = df.to_json()
    response = json.loads(data)

    return response


@router.get("/{organization_id}/path", response_model=List[Organization])
def get_path(
    organization_id: int,
    auth=Depends(authorization("organizations:get_path")),
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [org.to_schema() for org in organization.get_path(db, id=organization_id)]


@router.get(
    "/{organization_id}/get-centroid-organization", response_model=Coordinate
)
def get_center_from_organization(
    *,
    auth=Depends(authorization("organization:get_center_from_organization")),
    db: Session = Depends(get_db),
    organization_id: int,
    current_user: User = Depends(get_current_user),
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


@router.post("/{organization_id}/working_area", response_model=Organization)
async def upload_working_area(
    file: UploadFile = File(...),
    *,
    organization_id: int,
    auth=Depends(authorization("organizations:upload_working_area")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a geo file
    """
    try:
        filename_parts = os.path.splitext(file.filename)
        extension = filename_parts[1][1:]

        if extension not in ["zip", "geojson"]:
            raise HTTPException(
                status_code=415, detail="File format unsupported"
            )

        unique_name = uuid.uuid4()
        unique_filename = f"{unique_name}.{extension}"
        copy_filename = f"{settings.UPLOADED_FILES_FOLDER}/{unique_filename}"
        copy_file = await file.read()

        with open(copy_filename, "wb") as f:
            f.write(copy_file)  # type: ignore

        c = fiona.open(copy_filename)
        record = next(iter(c))

        if not record["geometry"]["type"]:
            raise HTTPException(status_code=415, detail="File unsupported")

        organization_in_db = organization.get(db, id=organization_id)

        if not organization_in_db:
            raise HTTPException(
                status_code=404, detail="Organization not found"
            )

        shape_working_area = shape(record["geometry"])
        working_area = shape_working_area.wkt

        if record["geometry"]["type"] == "Polygon":
            working_area = MultiPolygon([shape_working_area]).wkt

        return organization.update(
            db,
            db_obj=organization_in_db,
            obj_in={"working_area": working_area},
        ).to_schema()

    finally:
        os.remove(copy_filename)
        await file.close()


@router.get("/{organization_id}/working_area")
def get_working_area(
    *,
    organization_id: int,
    auth=Depends(authorization("organizations:get_working_area")),
    db: Session = Depends(get_db),
) -> Any:
    """
    get working_area geojson from one organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    if organization_in_db.working_area is None:
        raise HTTPException(status_code=404, detail="Organization working area is empty")

    shape = to_shape(organization_in_db.working_area)

    return {"type": "Feature", "geometry": mapping(shape), "properties": {}}
