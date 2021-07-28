import pytest
from fastapi.testclient import TestClient

from app.tests.utils.security import users_parameters

def test_generate_style(
    client: TestClient
):
    response = client.get(
        "/maps/style?theme=light&background=satellite",
    )

    assert response.status_code == 200
    assert response.json()["center"] == [
        -3.7091843212851927,
        40.41465637295403
    ]

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_geojson(
    client,
    mode_organization,
    role,
    status_code,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)

    response = client.get(
        f"/maps/geojson?organization_id={organization_id}",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code
 
@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_geobuf(
    client,
    mode_organization,
    role,
    status_code,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)

    response = client.get(
        f"/maps/geobuf?organization_id={organization_id}",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_filter(
    client,
    mode_organization,
    role,
    status_code,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)

    response = client.get(
        f"/maps/filter?organization_id={organization_id}",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_bbox(
    client,
    mode_organization,
    role,
    status_code,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)
    create_tree(mock_data["organization"].id, mock_data["user"].id)

    response = client.get(
        f"/maps/bbox?organization_id={organization_id}",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code