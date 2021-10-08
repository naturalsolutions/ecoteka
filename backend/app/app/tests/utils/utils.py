from typing import Dict

from fastapi.testclient import TestClient

from app.core.config import settings


def login_with_superuser(client: TestClient):
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = client.post("/auth/login", data=login_data)
    return response.json()


def get_superuser_refresh_token_headers(client: TestClient) -> Dict[str, str]:
    tokens = login_with_superuser(client)
    refresh_token = tokens["refresh_token"]
    headers = {"Authorization": f"Bearer {refresh_token}"}
    return headers


def get_superuser_access_token_headers(client: TestClient) -> Dict[str, str]:
    tokens = login_with_superuser(client)
    access_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    return headers
