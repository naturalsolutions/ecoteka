import pytest
from typing import Dict
from fastapi.testclient import TestClient
from app.models import organization
from app.tests.utils.security import users_parameters
from faker import Faker
from faker.providers import internet
from app.crud import crud_user

fake = Faker()
fake.add_provider(internet)

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "manager"],
        "open": ["admin", "manager"],
        "participatory": ["admin", "manager"]
    })
)
def test_add_members(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    invites = [{
        "email": "admin@example.com",
        "full_name": "Admin",
        "role": "admin"
    }, {
        "email": "manager@example.com",
        "full_name": "Manager",
        "role": "manager"
    }, {
        "email": "contributor@example.com",
        "full_name": "Contributor",
        "role": "contributor"
    }, {
        "email": "reader@example.com",
        "full_name": "Reader",
        "role": "reader"
    }]

    response = client.post(
        f"/organization/{organization_id}/members", 
        headers=mock_data["headers"],
        json=invites
    )
    
    assert response.status_code == status_code

    if status_code == 200:
        users = response.json()
        for user, invite in zip(users, invites):
            assert user["email"] == invite["email"]
            assert user["role"] == invite["role"]
            assert user["full_name"] == invite["full_name"]

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "manager", "contributor", "reader"],
        "open": ["admin", "manager", "contributor", "reader"],
        "participatory": ["admin", "manager", "contributor", "reader"]
    })
)
def test_get_one(
    client: TestClient, 
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    response = client.get(
        f"/organization/{organization_id}/members", 
        headers=mock_data["headers"]
    )
    assert response.status_code == status_code

    if status_code == 200:
        user = mock_data["user"].as_dict()
        user["role"] = role
        del user["hashed_password"]
        assert response.json() == [user]


@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "manager"],
        "open": ["admin", "manager"],
        "participatory": ["admin", "manager"]
    })
)
def test_remove_members(
    client: TestClient, 
    mode_organization: str,
    role: str,
    status_code: int,
    db,
    enforcer,
    headers_user_and_organization_from_organization_role):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id    
    user_in = crud_user.UserCreate(**{
        "email": fake.email(),
        "password": "password",
        "full_name": fake.name()
    })

    user_in_db = crud_user.user.create(db, obj_in=user_in)

    enforcer.add_role_for_user_in_domain(
        str(user_in_db.id), role, str(mock_data["organization"].id)
    )
    enforcer.load_policy()


    response = client.delete(
        f"/organization/{organization_id}/members/{user_in_db.id}", 
        headers=mock_data["headers"]
    )
     
    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "manager"],
        "open": ["admin", "manager"],
        "participatory": ["admin", "manager"]
    })
)
def test_update_member_role(
    client: TestClient, 
    mode_organization: str,
    role: str,
    status_code: int,
    db,
    enforcer,
    headers_user_and_organization_from_organization_role):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id    
    user_in = crud_user.UserCreate(**{
        "email": fake.email(),
        "password": "password",
        "full_name": fake.name()
    })

    user_in_db = crud_user.user.create(db, obj_in=user_in)

    enforcer.add_role_for_user_in_domain(
        str(user_in_db.id), role, str(mock_data["organization"].id)
    )
    enforcer.load_policy()
    roles_order = ["admin", "owner", "manager", "contributor", "reader", "guest"]

    for role_user in roles_order:
        response = client.patch(
            f"/organization/{organization_id}/members/{user_in_db.id}/role", 
            headers=mock_data["headers"],
            json={"role": role_user }
        )

        if mock_data["role"] == role:
            assert response.status_code == 403
        elif roles_order.index(role) >= roles_order.index(role_user):
            assert response.status_code == 403
        else:
            assert response.status_code == status_code