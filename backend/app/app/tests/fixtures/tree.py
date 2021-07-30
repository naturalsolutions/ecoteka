import pytest
from typing import Optional
from app.models.tree import Tree
from app.schemas.tree import TreeCreate
from app.crud import crud_tree


@pytest.fixture
def create_tree(db, faker, create_user):
    def decorator(
        organization_id: int, user_id: Optional[int] = None, properties={}
    ) -> Tree:
        if user_id is None:
            user_id = create_user().id

        x = faker.unique.longitude()
        y = faker.unique.latitude()

        tree_data = TreeCreate(
            geom=f"POINT({x} {y})",
            user_id=user_id,
            organization_id=organization_id,
            properties=properties,
        )

        return crud_tree.tree.create(db, obj_in=tree_data)

    return decorator


@pytest.fixture
def delete_tree(db):
    def decorator(tree_id: int):
        crud_tree.tree.remove(db, id=tree_id)

    return decorator
