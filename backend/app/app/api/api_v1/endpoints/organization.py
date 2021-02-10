import json
import logging
import os
import uuid
import fiona
from datetime import datetime
import numpy as np
from typing import Any, List, Optional, Dict
import geopandas as gpd
from shapely.geometry import shape
from shapely.geometry.geo import mapping
from shapely.geometry.multipolygon import MultiPolygon
from geoalchemy2.shape import to_shape
from passlib import pwd
from fastapi import APIRouter, Body, Depends, HTTPException, File, UploadFile
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.api import get_db
from app import crud
from app.core import settings, enforcer, set_policies, authorization, get_current_user

from app.crud import organization, user, tree
from app.schemas import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationMetrics,
    Coordinate,
    UserOut,
    UserInvite,
    UserCreate,
)
from app.models import User
from app.worker import send_new_invitation_email_task


router = APIRouter()

policies = {
    "organizations:get_one": ["owner", "manager", "contributor", "reader"],
    "organizations:get_teams": ["owner", "manager", "contributor", "reader"],
    "organizations:delete_team": ["owner", "manager"],
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
    "organizations:get_metrics": [
        "owner",
        "manager",
        "contributor",
    ],
}
set_policies(policies)


@router.post("", response_model=Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
):
    new_organization = organization.create(db, obj_in=organization_in).to_schema()
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


@router.get("/{organization_id}", response_model=Organization)
def get_one(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:get_one")),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Optional[Organization]:
    """
    get one organization by id
    """
    organization_in_db = organization.get(db, id=organization_id)
    current_roles = enforcer.get_roles_for_user_in_domain(str(current_user.id), str(organization_id))

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    organization_as_dict = organization_in_db.to_schema().__dict__
    organization_as_dict["current_user_role"] = current_roles[0]

    return organization_as_dict


@router.get("/{organization_id}/teams", response_model=List[Organization])
def get_teams(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:get_teams")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        org.to_schema() for org in organization.get_teams(db, parent_id=organization_id)
    ]


@router.post("/{organization_id}/teams/bulk_delete", response_model=List[Organization])
def delete_teams(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:delete_team")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    team_ids_in: List[int],
):
    """
    bulk delete teams and their members
    """
    teams_out = []
    for team_id in team_ids_in:   
        organization_in_db = organization.get(db, id=team_id)

        if not organization_in_db:
            raise HTTPException(status_code=404, detail="Team not found")

        try:
            members_in_db = crud.organization.get_members(db, id=team_id)

            for member in members_in_db:
                current_roles = enforcer.get_roles_for_user_in_domain(
                    str(member["id"]), str(team_id)
                )

                for current_role in current_roles:
                    enforcer.delete_roles_for_user_in_domain(
                        str(member["id"]), current_role, str(team_id)
                    )
        except Exception as e:
            logging.error(e)
        organization.remove(db, id=team_id)
        teams_out.append(dict(organization_in_db.as_dict()))
        
    return teams_out


@router.post("/{organization_id}/teams/bulk_archive", response_model=List[Organization])
def archive_teams(
    organization_id: int,
    *,
    auth=Depends(authorization("organizations:delete_team")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    team_ids_in: List[int],
):
    """
    Bulk archive teams
    """
    teams_out = []
    for team_id in team_ids_in:
        organization_in_db = organization.get(db, id=team_id)

        if not organization_in_db:
            raise HTTPException(status_code=404, detail="Team not found")
        organization_in_db.archived = True
        organization_in_db.archived_at = datetime.now()
        db.add(organization_in_db)
        db.commit()
        db.refresh(organization_in_db)
        teams_out.append(dict(organization_in_db.as_dict()))
    return teams_out



@router.delete("/{organization_id}/teams/{team_id}")
def remove_team(
    organization_id: int,
    team_id: int,
    *,
    auth=Depends(authorization("organizations:delete_team")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    delete one team and its members by id
    """
    organization_in_db = organization.get(db, id=team_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Team not found")

    try:
        members_in_db = crud.organization.get_members(db, id=team_id)

        for member in members_in_db:
            current_roles = enforcer.get_roles_for_user_in_domain(
                str(member["id"]), str(team_id)
            )

            for current_role in current_roles:
                enforcer.delete_roles_for_user_in_domain(
                    str(member["id"]), current_role, str(team_id)
                )
    except Exception as e:
        logging.error(e)
        return False
    organization.remove(db, id=team_id)
    return True


@router.delete(
    "/{organization_id}/teams/{team_id}/archive", response_model=Organization
)
def archive_team(
    organization_id: int,
    team_id: int,
    *,
    auth=Depends(authorization("organizations:delete_team")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Archive one team by id
    """
    organization_in_db = organization.get(db, id=team_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Team not found")
    organization_in_db.archived = True
    organization_in_db.archived_at = datetime.now()
    db.add(organization_in_db)
    db.commit()
    db.refresh(organization_in_db)
    return organization_in_db


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
            role = invite.role if invite.role else "guest"
            
            if not user_in_db:
                user_in_db = user.create(
                    db,
                    obj_in=UserCreate(
                        full_name=invite.full_name,
                        email=invite.email,
                        password=pwd.genword(),
                    ),
                )
            else:
                organization_in_db = crud.organization.get(db, id=organization_id)

                if organization_in_db:
                    send_new_invitation_email_task.delay(
                        full_name=user_in_db.full_name,
                        email_to=user_in_db.email,
                        organization=organization_in_db.name, 
                        role=role)

            enforcer.add_role_for_user_in_domain(
                str(user_in_db.id),
                role,
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
    role: str = Body(..., embed=True),
    auth=Depends(authorization("organizations:edit_member")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    roles_order = ["admin", "owner", "manager", "contributor", "reader", "guest"]

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
        
    if roles_order.index(current_user_role) >= roles_order.index(role):
        raise HTTPException(
            status_code=403, detail="You can only set roles below yours"
        )

    user_roles = enforcer.get_roles_for_user_in_domain(
        str(user_id), str(organization_id)
    )

    # Role exist for this user (it's a patch)
    if len(user_roles) > 0:
        user_role = user_roles[0]
        if roles_order.index(current_user_role) >= roles_order.index(user_role):
            raise HTTPException(
                status_code=403, detail="You can't edit a role above yours"
            )

        enforcer.delete_roles_for_user_in_domain(
            str(user_id), user_role, str(organization_id)
        )
        enforcer.add_role_for_user_in_domain(str(user_id), role, str(organization_id))
        # need ro reload handle new policy
        enforcer.load_policy()

    return dict(user_in_db, role=role)


@router.get("/{organization_id}/geojson", dependencies=[
    Depends(authorization("organizations:get_geojson"))
])
def get_geojson(
    organization_id: int,
    db: Session = Depends(get_db),
) -> Dict:
    """
    generate geojson from organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_in_db.id} AND status NOT IN ('frozen', 'import')"
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


@router.get("/{organization_id}/get-centroid-organization", response_model=Coordinate)
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

        if extension not in ["geojson"]:
            raise HTTPException(status_code=415, detail="File format unsupported")

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
            raise HTTPException(status_code=404, detail="Organization not found")

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
        raise HTTPException(
            status_code=404, detail="Organization working area is empty"
        )

    shape = to_shape(organization_in_db.working_area)

    return {"type": "Feature", "geometry": mapping(shape), "properties": {}}

@router.get("/{organization_id}/metrics_by_year/{year}", response_model=OrganizationMetrics)
def get_metrics(
    *,
    organization_id: int,
    year: int,
    auth=Depends(authorization("organizations:get_metrics")),
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
