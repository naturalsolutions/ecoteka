import json
import numpy as np
from typing import Any, List, Optional
import geopandas as gpd
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.api import get_db
from app.core import (
    enforcer,
    set_policies,
    authorization,
    get_current_user,
    get_current_active_user
)
from app.crud import (
    organization,
    user
)
from app.schemas import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
    Coordinate,
    UserOut
)
from app.models import (
    User
)


router = APIRouter()

policies = {
    'organizations:get_one': ['owner', 'manager', 'contributor', 'reader'],
    'organizations:get_teams': ['owner', 'manager', 'contributor', 'reader'],
    'organizations:get_members': ['owner', 'manager', 'contributor', 'reader'],
    'organizations:update': ['owner'],
    'organizations:edit_member': ['owner', 'manager'],
    'organizations:get_geojson': ['owner', 'manager', 'contributor', 'reader'],
    'organizations:get_path': ['owner', 'manager', 'contributor', 'reader'],
    'organization:get_center_from_organization': ['owner', 'manager', 'contributor', 'reader']
}
set_policies(policies)


@router.post('/', response_model=Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_active_user)
):
    new_organization = organization.create(db, obj_in=organization_in).to_schema()
    enforcer.add_role_for_user_in_domain(
        str(current_user.id),
        'owner',
        str(new_organization.id)
    )
    return new_organization


@router.patch("/{organization_id}", response_model=Organization)
def update_organization(
    organization_id: int,
    *,
    auth=Depends(authorization('organizations:update')),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    organization: OrganizationUpdate
):
    org = organization.get(db, id=organization_id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return organization.update(
        db,
        db_obj=org,
        obj_in=jsonable_encoder(organization, exclude_unset=True)
    )


@router.get("/{organization_id}")
def get_one(
    *,
    auth = Depends(authorization('organizations:get_one')),
    organization_id: int,
    db: Session = Depends(get_db),
) -> Optional[Organization]:
    """
    get one organization by id
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    total_trees = organization.get_total_tree_by_id(
        db, id=organization_id)

    if not total_trees:
        total_trees = 0

    organization_response = Organization(
        **jsonable_encoder(organization_in_db.to_schema(), exclude=['total_trees']),
        total_trees = total_trees
    )

    return organization_response


@router.get("/{organization_id}/teams", response_model=List[Organization])
def get_teams(
    organization_id: int,
    *,
    auth = Depends(authorization('organizations:get_teams')),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        org.to_schema() for org in organization.get_teams(db, parent_id=organization_id)
    ]


@router.get("/{organization_id}/members")
def get_members(
    organization_id: int,
    *,
    auth = Depends(authorization('organizations:get_members')),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = text("SELECT v0 AS user_id, v1 as role FROM casbin_rule WHERE v2 = :org_id")
    user_ids = db.execute(t, {'org_id':str(organization_id)})

    result = []
    for (userid, role) in user_ids:
        user_in_db = user.get(db, id=int(userid))

        if user_in_db:
            result.append(dict(user_in_db.as_dict(), role=role))

    return result


@router.patch("/{organization_id}/members/{user_id}/role")
def update_member_role(
    organization_id: int,
    user_id: int,
    *,
    role: str = Body(...),
    auth=Depends(authorization('organizations:edit_member')),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roles_order = ['owner', 'manager', 'contributor', 'reader', 'guest']

    if role not in roles_order:
        raise HTTPException(
            status_code=400,
            detail=f"This role : {role} does not exist"
        )

    user_in_db = user.get(db, id=user_id)

    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert to sqlalchemy obj to UserOut schema for hidding password
    user_in_db = UserOut(**user_in_db.as_dict())

    current_user_roles = enforcer.get_roles_for_user_in_domain(
        str(current_user.id),
        str(organization_id)
    )

    if len(current_user_roles) > 0:
        current_user_role = current_user_roles[0]

    if roles_order.index(current_user_role) > roles_order.index(role):
        raise HTTPException(
            status_code=403,
            detail="You can only set roles below yours"
        )

    user_roles = enforcer.get_roles_for_user_in_domain(str(user_id), str(organization_id))

    # No role for this user (it's a post)
    if len(user_roles) == 0:
        enforcer.add_role_for_user_in_domain(str(user_id), role, str(organization_id))
        # need ro reload new policy
        enforcer.load_policy()

    # Role exist for this user (it's a patch)
    if len(user_roles) > 0:
        user_role = user_roles[0]
        if roles_order.index(current_user_role) > roles_order.index(user_role):
            raise HTTPException(
                    status_code=403,
                    detail="You can't edit a role above yours"
                )

        enforcer.delete_roles_for_user_in_domain(str(user_id),  user_role, str(organization_id))
        enforcer.add_role_for_user_in_domain(str(user_id), role, str(organization_id))
        # need ro reload handle new policy
        enforcer.load_policy()


    return dict(
        user_in_db,
        role=role
    )


@router.get("{organization_id}/geojson")
def get_geojson(
    *,
    organization_id: int,
    auth=Depends(authorization('organizations:get_geojson')),
    db: Session = Depends(get_db)
) -> Any:
    """
    generate geojson from organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f'SELECT * FROM public.tree WHERE organization_id = {organization_in_db.id}'
    df = gpd.read_postgis(sql, db.bind)
    data = df.to_json()
    geojson = json.loads(data)

    return geojson


@router.get("/{organization_id}/path", response_model=List[Organization])
def get_path(
    organization_id: int,
    auth=Depends(authorization('organizations:get_path')),
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        org.to_schema() for org in organization.get_path(db, id=id)
    ]


@router.get(
    "/{organization_id}/get-centroid-organization", response_model=Coordinate
)
def get_center_from_organization(
    *,
    auth=Depends(authorization('organization:get_center_from_organization')),
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
