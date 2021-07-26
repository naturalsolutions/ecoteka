import pytest
from typing import Dict
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters

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
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)

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
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    response = client.get(
        f"/organization/{organization_id}/interventions/{intervention.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == intervention.as_dict()

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_all(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    intervention_one = create_intervention(organization_id, mock_data["user"].id)
    intervention_two = create_intervention(organization_id, mock_data["user"].id)

    response = client.get(
        f"/organization/{organization_id}/interventions", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == [
            intervention_one.as_dict(), 
            intervention_two.as_dict()
        ]

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_update(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    intervention.intervention_type = "felling"
    response = client.patch(
        f"/organization/{organization_id}/interventions/{intervention.id}", 
        headers=mock_data["headers"],
        json=intervention.as_dict()
    )

    assert response.status_code == status_code

    if status_code == 200:
        assert response.json() == intervention.as_dict()

def test_update_not_found(
    client: TestClient,
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role("private", "admin")
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    intervention.intervention_type = "felling"
    response = client.patch(
        f"/organization/{organization_id}/interventions/50000", 
        headers=mock_data["headers"],
        json=intervention.as_dict()
    )

    assert response.status_code == 404

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    response = client.delete(
        f"/organization/{organization_id}/interventions/{intervention.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == intervention.as_dict()