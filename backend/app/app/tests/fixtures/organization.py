from typing import Dict, Optional
from pydantic.networks import EmailStr
import pytest
from faker import Faker

from app.models.organization import Organization
from app.schemas.organization import OrganizationCreateRoot, OrganizationMode
from app.crud import crud_organization


fake = Faker()

@pytest.fixture
def generate_organization_data():
    def decorator_generate_organization_data(
        owner_email: Optional[EmailStr] = fake.email(),
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Dict:
        return {
            "owner_email": owner_email,
            "name": fake.name(),
            "mode": mode
        }
    return decorator_generate_organization_data

@pytest.fixture
def create_organization_root(db):
    def decorator_create_organization(
        owner_email: Optional[EmailStr] = fake.email(),
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Organization:
        obj_in = OrganizationCreateRoot(**{
            "owner_email": owner_email,
            "name": fake.name(),
            "mode": mode
        })

        return crud_organization.organization.create_root(db, obj_in=obj_in)

    return decorator_create_organization