import pytest
from app.models.tree import Tree
from app.schemas.tree import TreeCreate
from app.crud import crud_tree

@pytest.fixture
def create_tree(db, faker):
    def decorator(organization_id: int, user_id: int) -> Tree:
        faker.random.seed()

        x = faker.unique.longitude()
        y = faker.unique.latitude()

        tree_data = TreeCreate(
            geom=f"POINT({x} {y})",
            user_id=user_id,
            organization_id=organization_id,
        )

        return crud_tree.tree.create(db, obj_in=tree_data)
    return decorator

