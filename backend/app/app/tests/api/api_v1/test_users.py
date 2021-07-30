from fastapi.testclient import TestClient


def test_read_users(client: TestClient, auth_user, delete_user):
    auth = auth_user(is_superuser=True)
    response = client.get("/users", headers=auth["headers"])
    delete_user(auth["user"].id)

    assert response.status_code == 200
    assert len(response.json()) > 0


def test_create_user(
    client: TestClient, auth_user, generate_user_data, delete_user
):
    auth = auth_user(is_superuser=True)
    user_data = generate_user_data()
    user_id = None
    response = client.post("/users", headers=auth["headers"], json=user_data)
    assert response.status_code == 200
    user_id = response.json()["id"]
    response = client.post("/users", headers=auth["headers"], json=user_data)
    assert response.status_code == 400
    delete_user(user_id)
    delete_user(auth["user"].id)


def test_read_user_me(client: TestClient, auth_user, delete_user):
    auth = auth_user()

    response = client.get("/users/me", headers=auth["headers"])
    assert response.status_code == 200
    assert response.json()["id"] == auth["user"].id

    delete_user(auth["user"].id)


def test_read_user_by_id(client: TestClient, auth_user, delete_user):
    auth = auth_user(is_superuser=True)

    response = client.get(f"/users/{auth['user'].id}", headers=auth["headers"])
    assert response.status_code == 200
    assert response.json()["id"] == auth["user"].id

    delete_user(auth["user"].id)

    # NO IS SUPERUSER
    auth = auth_user(is_superuser=False)

    response = client.get(f"/users/{auth['user'].id}", headers=auth["headers"])
    delete_user(auth["user"].id)
    assert response.status_code == 400
    assert (
        response.json()["detail"] == "The user doesn't have enough privileges"
    )


def test_update_user_me(client: TestClient, auth_user, delete_user, faker):
    auth = auth_user(is_superuser=True)
    data = {
        "password": faker.password(),
        "full_name": faker.name(),
        "email": faker.email(),
    }
    response = client.put("/users/me", headers=auth["headers"], json=data)
    assert response.status_code == 200
    assert response.json()["id"] == auth["user"].id
    assert response.json()["full_name"] == data["full_name"]
    assert response.json()["email"] == data["email"]

    delete_user(auth["user"].id)


def test_update_user(client: TestClient, auth_user, delete_user, faker):
    # NO IS SUPERUSER
    auth = auth_user(is_superuser=False)

    response = client.put(f"/users/{auth['user'].id}", headers=auth["headers"])
    delete_user(auth["user"].id)
    assert response.status_code == 403
    assert (
        response.json()["detail"] == "The user doesn't have enough privileges"
    )

    # NOT FOUND
    auth = auth_user(is_superuser=True)
    response = client.put("/users/12345", headers=auth["headers"], json={})
    delete_user(auth["user"].id)
    assert response.status_code == 404
    assert (
        response.json()["detail"]
        == "The user with this username does not exist in the system"
    )

    # UPDATE
    auth = auth_user(is_superuser=True)
    data = {
        "password": faker.password(),
        "full_name": faker.name(),
        "email": faker.email(),
    }
    response = client.put(
        f"/users/{auth['user'].id}", headers=auth["headers"], json=data
    )
    assert response.status_code == 200
    assert response.json()["id"] == auth["user"].id
    assert response.json()["full_name"] == data["full_name"]
    assert response.json()["email"] == data["email"]

    delete_user(auth["user"].id)
