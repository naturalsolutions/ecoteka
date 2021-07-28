from typing import Dict, Optional
from pydantic.networks import EmailStr
import pytest
from faker import Faker

from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationMode
from app.crud import crud_organization


fake = Faker()

@pytest.fixture
def create_team(db):
    def decorator_create_team(
        organization_id: int,
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Organization:
        obj_in = OrganizationCreate(**{
            "name": fake.name(),
            "mode": mode,
            "parent_id": organization_id
        })

        return crud_organization.organization.create(db, obj_in=obj_in)

    return decorator_create_team