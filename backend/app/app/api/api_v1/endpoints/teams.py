from typing import List
import logging

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session


from app.api import get_db
from app.core import enforcer, authorization, get_current_user, set_policies
from app import crud
from app.crud import organization
from app.models import User
from app.schemas import (
    Organization
)


router = APIRouter()

policies = {
    "organizations:get_teams": ["owner", "manager", "contributor", "reader"],
    "organizations:delete_team": ["owner", "manager"],
}
set_policies(policies)

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