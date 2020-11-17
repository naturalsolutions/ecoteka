from fastapi.testclient import TestClient
from app.core.config import settings
from typing import Dict
import json


new_user = {
    "full_name": 'test user',
    "email": 'test@mail.com',
    "organization": 'test organization',
    "password": 'toto'
}

def test_auth_login_first_superuser(client: TestClient) -> None:
    credentials = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post("/auth/login", data=credentials)
    access_token = r.json()

    assert r.status_code == 200
    assert access_token["access_token"]
    assert access_token["token_type"] == "Bearer"


def test_auth_login_bad_password(client: TestClient) -> None:
    credentials = {
        "username": "fake_user",
        "password": "fake_password",
    }
    r = client.post("/auth/login", data=credentials)
    error_message = r.json()

    assert r.status_code == 400
    assert error_message["detail"] == "Incorrect email or password"


def test_auth_register(client: TestClient, superuser_token_headers: Dict[str, str]) -> None:
    json_data = json.dumps(new_user)
    r = client.post(
        "/auth/register/",
        headers=superuser_token_headers,
        data=json_data
    )
    message = r.json()
    assert r.status_code == 200
    assert message["msg"] == 'user created'


def test_auth_register_user_exist(client: TestClient, superuser_token_headers: Dict[str, str]) -> None:
    json_data = json.dumps(new_user)
    r = client.post(
        "/auth/register/",
        headers=superuser_token_headers,
        data=json_data
    )
    message = r.json()
    assert r.status_code == 400
    assert message["detail"] == 'The user with this username already exists in the system.'