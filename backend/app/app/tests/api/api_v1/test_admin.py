from typing import Dict
from fastapi.testclient import TestClient


def test_get_organization_root_nodes(
    client: TestClient,
    auth_user,
    create_organization_root,
    add_user_to_organization,
    delete_user,
):
    superuser = auth_user(is_superuser=True)
    user_id = superuser["user"].id
    user_email = superuser["user"].email
    organization = create_organization_root(owner_email=user_email)
    add_user_to_organization(user_id=user_id, organization_id=organization.id)
    response = client.get(
        f"/admin/organization/root_nodes", headers=superuser["headers"]
    )

    delete_user(user_id)
    assert response.status_code == 200

    is_not_superuser = auth_user(is_superuser=False)
    response = client.get(
        f"/admin/organization/root_nodes", headers=is_not_superuser["headers"]
    )

    delete_user(user_id)
    assert response.status_code == 403


def test_create_organization_root_node(
    client: TestClient,
    auth_user,
    generate_organization_data,
    delete_user,
    faker,
):
    # IS NOT SUPERUSER
    is_not_superuser = auth_user(is_superuser=False)
    new_organization_data = generate_organization_data(
        owner_email=is_not_superuser["user"].email
    )
    response = client.post(
        f"/admin/organization/root_nodes",
        headers=is_not_superuser["headers"],
        json=new_organization_data,
    )
    delete_user(is_not_superuser["user"].id)
    assert response.status_code == 403

    # NO ORGANIZATION OWNER EMAIL
    superuser = auth_user(is_superuser=True)
    new_organization_data = generate_organization_data(
        owner_email=False
    )
    response = client.post(
        f"/admin/organization/root_nodes",
        headers=superuser["headers"],
        json=new_organization_data,
    )

    delete_user(superuser["user"].id)
    assert response.status_code == 200

    # NO USER IN DB
    superuser = auth_user(is_superuser=True)
    new_organization_data = generate_organization_data(
        owner_email=faker.email()
    )
    response = client.post(
        f"/admin/organization/root_nodes",
        headers=superuser["headers"],
        json=new_organization_data,
    )

    delete_user(superuser["user"].id)
    assert response.status_code == 200

    # USER IN DB
    superuser = auth_user(is_superuser=True)
    new_organization_data = generate_organization_data(
        owner_email=superuser["user"].email
    )
    response = client.post(
        f"/admin/organization/root_nodes",
        headers=superuser["headers"],
        json=new_organization_data,
    )

    delete_user(superuser["user"].id)
    assert response.status_code == 200
