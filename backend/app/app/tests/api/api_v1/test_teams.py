import pytest

from fastapi.testclient import TestClient
from fastapi.encoders import jsonable_encoder
from app.tests.utils.security import users_parameters

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_teams(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_team
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    team_a = create_team(organization_id)
    team_b = create_team(organization_id)
    response = client.get(
        f"/organization/{organization_id}/teams",
        headers=mock_data["headers"]
    )

    
    assert response.status_code == status_code
    
    if status_code == 200:
        response.json()[0]["id"] == team_a.id
        response.json()[1]["id"] == team_b.id

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager"],
        "open": ["admin", "owner", "manager"],
        "participatory": ["admin", "owner", "manager"]
    })
)
def test_remove_team(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_team
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    team = create_team(organization_id).to_schema()
    
    response = client.delete(
        f"/organization/{organization_id}/teams/{team.id}",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager"],
        "open": ["admin", "owner", "manager"],
        "participatory": ["admin", "owner", "manager"]
    })
)
def test_delete_teams(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_team
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    team_a = create_team(organization_id)
    team_b = create_team(organization_id)
    

    response = client.delete(
        f"/organization/{organization_id}/teams/bulk_delete",
        headers=mock_data["headers"],
        json=[team_a.id, team_b.id]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json()[0]["id"] == team_a.id
        response.json()[1]["id"] == team_b.id

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager"],
        "open": ["admin", "owner", "manager"],
        "participatory": ["admin", "owner", "manager"]
    })
)
def test_archive_team(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_team
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    team = create_team(organization_id).to_schema()
    
    response = client.delete(
        f"/organization/{organization_id}/teams/{team.id}/archive",
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        assert response.json()["archived"] == True

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager"],
        "open": ["admin", "owner", "manager"],
        "participatory": ["admin", "owner", "manager"]
    })
)
def test_archive_teams(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_team
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    team_a = create_team(organization_id)
    team_b = create_team(organization_id)


    response = client.delete(
        f"/organization/{organization_id}/teams/bulk_archive",
        headers=mock_data["headers"],
        json=[team_a.id, team_b.id]
    )

    assert response.status_code == status_code

    if status_code == 200:
        for team in response.json():
            assert team["archived"] == True
    