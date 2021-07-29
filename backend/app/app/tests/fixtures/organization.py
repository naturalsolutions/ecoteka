from typing import Dict, Optional
from pydantic.networks import EmailStr
import pytest

from app.models.organization import Organization
from app.schemas.organization import OrganizationCreateRoot, OrganizationMode
from app.crud import crud_organization

@pytest.fixture
def generate_organization_data(faker):
    def decorator_generate_organization_data(
        owner_email: Optional[EmailStr] = None,
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Dict:
        faker.random.seed()

        if owner_email is None:
            owner_email = faker.unique.email()
        return {
            "owner_email": owner_email,
            "name": faker.unique.name(),
            "mode": mode
        }
    return decorator_generate_organization_data

@pytest.fixture
def create_organization_root(db, faker):
    def decorator_create_organization(
        owner_email: Optional[EmailStr] = None,
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Organization:
        faker.random.seed()

        if owner_email is None:
            owner_email = faker.unique.email()
            
        obj_in = OrganizationCreateRoot(**{
            "owner_email": owner_email,
            "name": faker.unique.name(),
            "mode": mode
        })

        return crud_organization.organization.create_root(db, obj_in=obj_in)

    return decorator_create_organization