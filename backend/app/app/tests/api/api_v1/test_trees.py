import pytest
from typing import Dict
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters
from app.crud import crud_tree
from app.schemas import TreeCreate

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_add(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    new_tree_data = {
        "x": 4.269118928658703,
        "y": 43.79519801939514
    }

    response = client.post(
        f"/organization/{organization_id}/trees", 
        headers=mock_data["headers"],
        json=new_tree_data
    )

    assert response.status_code == status_code

    if status_code == 200:
        response_data = response.json()
        del response_data['id']
        assert response_data == {
            'properties': None, 
            'geofile_id': None, 
            'user_id': mock_data["user"].id, 
            'organization_id': organization_id, 
            'x': 4.269118928658703, 
            'y': 43.79519801939514
        }

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
       
    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()