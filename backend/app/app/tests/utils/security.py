from typing import Dict, List, Tuple
import pytest

from app.core.security import generate_access_token_and_refresh_token_response
from app.crud import crud_organization, crud_user
from enum import Enum


class OrganizationMode(Enum):
    private = "private"
    open = "open"
    participatory = "participatory"


def users_parameters(permissions: Dict[str, List[str]]) -> List[Tuple]:
    organizations_mode = ['private', 'open', 'participatory']
    roles = ["admin", "owner", "manager", "contributor", "reader"]
    status_codes: List[Tuple] = []    
    default_permissions: Dict[str, Dict[str, int]] = {}
   
    for organization_mode in organizations_mode:
        default_permissions[organization_mode] = {}
        for role in roles:
            default_permissions[organization_mode][role] = 403

    for organization_mode in permissions.keys():
        if organization_mode in organizations_mode:
            for role in permissions[organization_mode]:
                if role in roles:
                    default_permissions[organization_mode][role] = 200

    for organization_mode in default_permissions.keys():
        for role in default_permissions[organization_mode].keys():
            status_code = default_permissions[organization_mode][role]
            status_codes.append((organization_mode, role, status_code))

    return status_codes


@pytest.fixture(scope="function")
def headers_user_and_organization_from_organization_role(
    db, 
    create_organization_root,
    create_user,
    add_user_to_organization,
    delete_user
):
    user = create_user()
    organization = create_organization_root(owner_email=user.email)
    
    def decorator(
        organization_mode: OrganizationMode,
        role: str,
    ):
       
        organization.mode = organization_mode
        db.commit()    
        add_user_to_organization(
            organization_id=organization.id, 
            user_id=user.id,
            role=role
        )

        tokens = generate_access_token_and_refresh_token_response(user_id=user.id, is_superuser=False)
        access_token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}


        return {
            "headers": headers,
            "user": user,
            "organization": organization,
            "role": role
        }

    yield decorator

    crud_organization.organization.remove(db, id=organization.id)
    delete_user(user.id)
    