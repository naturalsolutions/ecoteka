import pytest
from faker import Faker
from faker.providers import geo
from app.models.intervention import Intervention
from app.schemas.intervention import InterventionCreate
from app.crud import crud_intervention


fake = Faker()
fake.add_provider(geo)

@pytest.fixture
def create_intervention(db, create_tree):
    def decorator(organization_id: int, user_id: int) -> Intervention:
        tree = create_tree(organization_id, user_id)
        new_intervention = InterventionCreate(
            tree_id = tree.id,
            intervention_type ="pruning",
            organization_id = organization_id
        )
        return crud_intervention.intervention.create(db, obj_in=new_intervention)

    return decorator

