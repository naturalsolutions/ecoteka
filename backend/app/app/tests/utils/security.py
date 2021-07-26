from typing import Dict, List, Tuple
import pytest

from app.core.security import generate_access_token_and_refresh_token_response
from app.crud import crud_organization, crud_user
from faker import Faker
from faker.providers import internet

fake = Faker()
fake.add_provider(internet)

from enum import Enum


class OrganizationMode(Enum):
    private = "private"
    open = "open"
    participatory = "participatory"


def users_parameters(permissions: Dict[str, List[str]]) -> List[Tuple]:
    organizations_mode = ['private', 'open', 'participatory']
    roles = ["admin", "manager", "contributor", "reader"]
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
def headers_user_and_organization_from_organization_role(enforcer, db):
    organization_in = crud_organization.OrganizationCreate(**{
        "name": fake.name(),
        "mode": "private"
    })
    organization_in_db = crud_organization.organization.create(db, obj_in=organization_in)

    user_in = crud_user.UserCreate(**{
        "email": fake.email(),
        "password": "password",
        "full_name": fake.name()
    })

    user_in_db = crud_user.user.create(db, obj_in=user_in)
        
    def decorator(
        organization_mode: OrganizationMode,
        role: str,
    ):
        organization_in_db.mode = organization_mode
        db.commit()    

        enforcer.add_role_for_user_in_domain(
            str(user_in_db.id), role, str(organization_in_db.id)
        )
        enforcer.load_policy()

        tokens = generate_access_token_and_refresh_token_response(user_id=user_in_db.id, is_superuser=False)
        access_token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}


        return {
            "headers": headers,
            "user": user_in_db,
            "organization": organization_in_db,
            "role": role
        }

    yield decorator

    crud_organization.organization.remove(db=db, id=organization_in_db.id)
    crud_user.user.remove(db=db, id=user_in_db.id)
    enforcer.delete_user(str(user_in_db.id))
    enforcer.load_policy()