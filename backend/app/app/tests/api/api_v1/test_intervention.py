import pytest
from typing import Dict
from fastapi.testclient import TestClient
from app.models import intervention
from app.tests.utils.security import users_parameters
from app.crud import crud_tree, crud_intervention
from app.schemas.tree import TreeCreate
from app.schemas.intervention import InterventionCreate

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_create(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    db,
    headers_user_and_organization_from_organization_role
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    x = 4.269118928658703
    y = 43.79519801939514

    tree_with_user_info = TreeCreate(
        geom=f"POINT({x} {y})",
        user_id=mock_data["user"].id,
        organization_id=organization_id,
    )

    tree = crud_tree.tree.create(db, obj_in=tree_with_user_info)
   
    new_intervention = {
        "tree_id": tree.id,
        "intervention_type": "pruning"
    }

    response = client.post(
        f"/organization/{organization_id}/interventions", 
        headers=mock_data["headers"],
        json=new_intervention
    )

    assert response.status_code == status_code

    if status_code == 200:
        intervention = response.json()
        assert intervention["organization_id"] == organization_id
        assert intervention["tree_id"] == tree.id
        assert intervention["intervention_type"] == new_intervention["intervention_type"]


@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    db,
    headers_user_and_organization_from_organization_role
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    x = 4.269118928658703
    y = 43.79519801939514

    tree_with_user_info = TreeCreate(
        geom=f"POINT({x} {y})",
        user_id=mock_data["user"].id,
        organization_id=organization_id,
    )

    tree = crud_tree.tree.create(db, obj_in=tree_with_user_info)
   
    new_intervention = InterventionCreate(
        tree_id = tree.id,
        intervention_type ="pruning",
        organization_id = organization_id
    )

    intervention = crud_intervention.intervention.create(db, obj_in=new_intervention)
       
    response = client.get(
        f"/organization/{organization_id}/interventions/{intervention.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == intervention.as_dict()