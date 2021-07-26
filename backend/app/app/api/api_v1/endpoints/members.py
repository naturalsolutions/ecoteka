from typing import Any, List, Dict
import logging

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib import pwd

from app import crud
from app.crud import user
from app.api import get_db
from app.core import authorization, get_current_user, settings
from app.models import User
from app.schemas import (
    UserOut,
    UserInvite,
    UserCreate,
)
from app.worker import send_new_invitation_email_task
from app.api.deps import get_enforcer

settings.policies["members"] = {
    "organizations:get_members": ["admin", "manager", "contributor", "reader"],
    "organizations:add_members": ["admin", "manager"],
    "organizations:remove_member": ["admin", "manager"],
    "organizations:edit_member": ["admin", "manager"],
}


router = APIRouter()


@router.get(
    "/{organization_id}/members", 
    dependencies=[Depends(authorization("organizations:get_members"))]
)
def get_members(
    organization_id: int,
    *,
    db: Session = Depends(get_db)
):
    return crud.organization.get_members(db, id=organization_id)


@router.post(
    "/{organization_id}/members", 
    dependencies=[Depends(authorization("organizations:add_members"))]
)
def add_members(
    organization_id: int,
    *,
    invites: List[UserInvite] = Body(...),
    db: Session = Depends(get_db),
    enforcer = Depends(get_enforcer)
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
            role = invite.role if invite.role else "reader"
            
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
            for user in crud.organization.get_members(db, id=organization_id)
            if user.get("email") in (invite.email for invite in invites)
        ]
    except Exception as e:
        logging.error(e)


@router.delete(
    "/{organization_id}/members/{user_id}",
    dependencies=[Depends(authorization("organizations:remove_member"))]
)
def remove_member(
    organization_id: int,
    user_id: int,
    *,
    db: Session = Depends(get_db),
    enforcer = Depends(get_enforcer)
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


@router.patch("/{organization_id}/members/{user_id}/role", dependencies=[
    Depends(authorization("organizations:edit_member"))
])
def update_member_role(
    organization_id: int,
    user_id: int,
    *,
    role: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    enforcer = Depends(get_enforcer)
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