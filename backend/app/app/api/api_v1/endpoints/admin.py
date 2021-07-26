from app.api.deps import get_enforcer

from passlib import pwd

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app import crud
from app.api import get_db
from app.core import get_current_user
from app.crud import organization, user

from app.schemas import (
    Organization,
    OrganizationCreateRoot,
    UserCreate,
)
from app.models import User
from app.worker import send_new_invitation_email_task

router = APIRouter()

@router.get("/organization/root_nodes", response_model=List[Organization])
def get_organization_root_nodes(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    enforcer = Depends(get_enforcer)
) -> Optional[List[Organization]]:
    """
    **Admin only**; Get all organizations trees root nodes;
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )
    
    root_nodes_in_db = crud.organization.get_root_nodes(db)
    root_nodes = []
    for org_in_db in root_nodes_in_db:
        current_roles = enforcer.get_roles_for_user_in_domain(str(current_user.id), str(org_in_db.id))
        org = org_in_db.to_schema()
        if len(current_roles) > 0:
            org.current_user_role = current_roles[0]
            root_nodes.append(org)
        else:
            root_nodes.append(org)
    return root_nodes


@router.post("/organization/root_nodes", response_model=Organization)
def create_organization_root_node(
    *,
    db: Session = Depends(get_db),
    organization_in: OrganizationCreateRoot,
    current_user: User = Depends(get_current_user),
    enforcer = Depends(get_enforcer)
) -> Optional[Organization]:
    """
    Create a new **root node for organizations tree**;
    
    If `owner_email` is present organization tree ownership will be affected to *existing or newly created user*,
    else organizations tree ownership will be affected to *superuser*.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )
    new_organization_root_node = organization.create_root(db, obj_in=organization_in).to_schema()
    if organization_in.owner_email:
        user_in_db = user.get_by_email(db, email=organization_in.owner_email)
        if not user_in_db:
            user_in_db = user.create(
                db,
                obj_in=UserCreate(
                    full_name=organization_in.owner_email.split("@")[0],
                    email=organization_in.owner_email,
                    password=pwd.genword(),
                ),
            )
        if new_organization_root_node:
            send_new_invitation_email_task.delay(
                full_name=user_in_db.full_name,
                email_to=user_in_db.email,
                organization=new_organization_root_node.name, 
                role="owner")
            enforcer.add_role_for_user_in_domain(
                str(user_in_db.id), "owner", str(new_organization_root_node.id)
            )
            enforcer.load_policy()
    else:
        enforcer.add_role_for_user_in_domain(
            str(current_user.id), "owner", str(new_organization_root_node.id)
        )
        enforcer.load_policy()
    current_roles = enforcer.get_roles_for_user_in_domain(str(current_user.id), str(new_organization_root_node.id))
    if len(current_roles) > 0:
        new_organization_root_node.current_user_role = current_roles[0]
    if current_user.is_superuser:
        new_organization_root_node.current_user_role = 'admin'
    # new_organization_root_node.current_user_role = current_roles[0]
    return new_organization_root_node