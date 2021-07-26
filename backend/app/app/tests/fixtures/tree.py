import pytest
from faker import Faker
from faker.providers import geo
from app.models.tree import Tree
from app.schemas.tree import TreeCreate
from app.crud import crud_tree


fake = Faker()
fake.add_provider(geo)

@pytest.fixture
def create_tree(db):
    def decorator(organization_id: int, user_id: int) -> Tree:
        x = fake.longitude()
        y = fake.latitude()

        tree_data = TreeCreate(
            geom=f"POINT({x} {y})",
            user_id=user_id,
            organization_id=organization_id,
        )

        return crud_tree.tree.create(db, obj_in=tree_data)
    return decorator

