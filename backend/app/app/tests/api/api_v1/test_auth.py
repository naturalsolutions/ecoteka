from typing import Dict

from fastapi.testclient import TestClient

from app.core.config import settings


def test_login_and_get_refresh_token(client: TestClient) -> None:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = client.post("/auth/login", data=login_data)
    tokens = response.json()
    assert response.status_code == 200
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert "token_type" in tokens
    assert tokens["access_token"]
    assert tokens["refresh_token"]


def test_login_and_get_refresh_token_email_error(client: TestClient) -> None:
    login_data = {
        "username": "new_user@ecoteka.org",
        "password": "password",
    }
    response = client.post("/auth/login", data=login_data)
    result = response.json()
    assert response.status_code == 400
    assert result["detail"] == "Incorrect email or password"


def test_get_access_token(
    client: TestClient, superuser_refresh_token_headers: Dict[str, str]
) -> None:
    response = client.post(
        "/auth/access_token",
        headers=superuser_refresh_token_headers,
    )
    result = response.json()
    assert response.status_code == 200
    assert "access_token" in result
    assert "token_type" in result


def test_get_refresh_token(
    client: TestClient, superuser_refresh_token_headers: Dict[str, str]
) -> None:
    response = client.post(
        "/auth/refresh_token",
        headers=superuser_refresh_token_headers,
    )
    result = response.json()
    assert response.status_code == 200
    assert "access_token" in result
    assert "refresh_token" in result
    assert "token_type" in result


def test_password_recovery_email(client: TestClient) -> None:
    response = client.post(f"/auth/password-recovery/{settings.FIRST_SUPERUSER}")
    result = response.json()
    assert response.status_code == 200
    assert result["msg"] == "Password recovery email sent"


def test_password_recovery_email_error_email(client: TestClient) -> None:
    response = client.post(f"/auth/password-recovery/new_user@ecoteka.org")
    result = response.json()
    assert response.status_code == 404
    assert (
        result["detail"] == "The user with this username does not exist in the system."
    )


def test_reset_password(
    client: TestClient, superuser_access_token_headers: Dict[str, str]
) -> None:
    reset_password_data = {"new_password": settings.FIRST_SUPERUSER_PASSWORD}
    response = client.post(
        "/auth/reset-password",
        headers=superuser_access_token_headers,
        json=reset_password_data,
    )
    result = response.json()
    assert response.status_code == 200
    assert result["msg"] == "Password updated successfully"


def test_register(
    client: TestClient, superuser_access_token_headers: Dict[str, str]
) -> None:
    new_user_data = {
        "email": "new_user@ecoteka.org",
        "full_name": "new user",
        "password": "password",
    }
    response = client.post(
        "/auth/register", headers=superuser_access_token_headers, json=new_user_data
    )
    result = response.json()
    assert response.status_code == 200
    assert result["msg"] == "User created"


def test_register_error_user_already_exits(
    client: TestClient, superuser_access_token_headers: Dict[str, str]
) -> None:
    new_user_data = {
        "email": "new_user@ecoteka.org",
        "full_name": "new user",
        "password": "password",
    }
    response = client.post(
        "/auth/register", headers=superuser_access_token_headers, json=new_user_data
    )
    result = response.json()
    assert response.status_code == 400
    assert (
        result["detail"] == "The user with this username already exists in the system."
    )
