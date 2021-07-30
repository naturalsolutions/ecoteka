from fastapi.exceptions import HTTPException
import pytest
from starlette.testclient import TestClient
from app.core import settings
from fastapi_jwt_auth import AuthJWT
from app.core.security import (
    generate_access_token_and_refresh_token_response,
    get_current_user_with_refresh_token,
    get_current_user,
    get_current_user_if_is_superuser,
    get_optional_current_active_user,
    authorization,
)


@AuthJWT.load_config
def get_config():
    return settings


@pytest.fixture(scope="module")
def tokens():
    def decorator_tokens(user_id: int, is_superuser: bool = False):
        return generate_access_token_and_refresh_token_response(
            user_id, is_superuser
        )

    return decorator_tokens


def test_generate_access_token_and_refresh_token_response():
    user_id = 1
    is_superuser = False
    tokens = generate_access_token_and_refresh_token_response(
        user_id, is_superuser
    )
    authorize = AuthJWT()

    access_token = authorize._verified_token(tokens["access_token"])
    assert tokens["token_type"] == "Bearer"
    assert access_token["sub"] == str(user_id)
    assert access_token["is_superuser"] == is_superuser

    refresh_token = authorize._verified_token(tokens["refresh_token"])
    assert tokens["token_type"] == "Bearer"
    assert refresh_token["sub"] == str(user_id)
    assert refresh_token["is_superuser"] == is_superuser


def test_get_current_user_with_refresh_token(db, client: TestClient, tokens):
    user_id = 1
    headers = {"Authorization": f"Bearer {tokens(user_id)['refresh_token']}"}
    response = client.get("/", headers=headers)
    user = get_current_user_with_refresh_token(
        db, AuthJWT(req=response.request)
    )
    assert user.id == user_id

    with pytest.raises(HTTPException):
        user_id = 1000
        headers = {
            "Authorization": f"Bearer {tokens(user_id)['refresh_token']}"
        }
        response = client.get("/", headers=headers)
        get_current_user_with_refresh_token(db, AuthJWT(req=response.request))


def test_get_current_user(db, client: TestClient, tokens):
    user_id = 1
    headers = {"Authorization": f"Bearer {tokens(user_id)['access_token']}"}
    response = client.get("/", headers=headers)
    user = get_current_user(db, AuthJWT(req=response.request))
    assert user.id == user_id

    with pytest.raises(HTTPException):
        user_id = 1000
        headers = {"Authorization": f"Bearer {tokens(user_id)['access_token']}"}
        response = client.get("/", headers=headers)
        get_current_user(db, AuthJWT(req=response.request))


def test_get_current_user_if_is_superuser(
    db, client: TestClient, tokens, create_user, delete_user
):
    user_id = 1
    is_superuser = True
    token = tokens(user_id, is_superuser)["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/", headers=headers)
    user = get_current_user_if_is_superuser(
        get_current_user(db, AuthJWT(req=response.request))
    )
    assert user.id == user_id

    with pytest.raises(HTTPException):
        user = create_user()
        headers = {
            "Authorization": f"Bearer {tokens(user.id, user.is_superuser)['access_token']}"
        }
        response = client.get("/", headers=headers)
        get_current_user_if_is_superuser(
            get_current_user(db, AuthJWT(req=response.request))
        )
        delete_user(user.id)


def test_get_optional_current_active_user(db, client: TestClient, tokens):
    user_id = 1
    token = tokens(user_id)["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/", headers=headers)
    user = get_optional_current_active_user(
        db, AuthJWT(req=response.request), token
    )

    assert user.id == user_id

    response = client.get("/")
    user = get_optional_current_active_user(
        db, AuthJWT(req=response.request), None
    )

    assert user == None
