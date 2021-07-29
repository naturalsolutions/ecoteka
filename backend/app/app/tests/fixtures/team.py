import pytest

from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationMode
from app.crud import crud_organization



@pytest.fixture
def create_team(db, faker):
    def decorator_create_team(
        organization_id: int,
        mode: OrganizationMode = OrganizationMode.PRIVATE 
    ) -> Organization:
        faker.random.seed()

        obj_in = OrganizationCreate(**{
            "name": faker.unique.name(),
            "mode": mode,
            "parent_id": organization_id
        })

        return crud_organization.organization.create(db, obj_in=obj_in)

    return decorator_create_team