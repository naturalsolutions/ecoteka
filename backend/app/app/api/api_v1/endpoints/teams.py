from typing import List
import logging

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session


from app.api import get_db
from app.core import authorization, get_current_user, settings
from app.api.deps import get_enforcer
from app import crud
from app.crud import organization
from app.models import User
from app.schemas import (
    Organization
)

settings.policies["teams"] = {
    "organizations:get_teams": ["admin", "owner", "manager", "contributor", "reader"],
    "organizations:delete_team": ["admin", "owner", "manager"],
    "organizations:delete_teams": ["admin", "owner", "manager"],
    "organizations:archive_team": ["admin", "owner", "manager"],
    "organizations:archive_teams": ["admin", "owner", "manager"]
}

router = APIRouter()


@router.get(
    "/{organization_id}/teams", 
    response_model=List[Organization],
    dependencies=[Depends(authorization("organizations:get_teams"))]
)
def get_teams(
    organization_id: int,
    *,
    db: Session = Depends(get_db),
):
    return [
        org.as_dict() for org in organization.get_teams(db, parent_id=organization_id)
    ]


@router.delete(
    "/{organization_id}/teams/bulk_delete", 
    response_model=List[Organization],
    dependencies=[Depends(authorization("organizations:delete_teams"))])
def delete_teams(
    *,
    db: Session = Depends(get_db),
    team_ids_in: List[int],
    enforcer=Depends(get_enforcer)
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
        teams_out.append(organization_in_db.as_dict())
        
    return teams_out


@router.delete(
    "/{organization_id}/teams/bulk_archive", 
    response_model=List[Organization],
    dependencies=[Depends(authorization("organizations:archive_teams"))]
)
def archive_teams(
    *,
    db: Session = Depends(get_db),
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
        db.commit()
        teams_out.append(organization_in_db.as_dict())
    
    return teams_out



@router.delete(
    "/{organization_id}/teams/{team_id}",
    dependencies=[Depends(authorization("organizations:delete_team"))]
)
def remove_team(
    team_id: int,
    *,
    db: Session = Depends(get_db),
    enforcer = Depends(get_enforcer)
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
    "/{organization_id}/teams/{team_id}/archive", 
    response_model=Organization,
    dependencies=[Depends(authorization("organizations:archive_team"))]
)
def archive_team(
    team_id: int,
    *,
    db: Session = Depends(get_db)
):
    """
    Archive one team by id
    """
    organization_in_db = organization.get(db, id=team_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Team not found")
    
    organization_in_db.archived = True
    organization_in_db.archived_at = datetime.now()
    db.commit()
    
    return organization_in_db