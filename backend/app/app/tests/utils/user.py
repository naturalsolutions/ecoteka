from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.crud import user
from app.models import User
from app.schemas import UserCreate, UserUpdate
from app.tests.utils.utils import random_email, random_lower_string


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}

    r = client.post("/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def create_random_user(db: Session) -> User:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(username=email, email=email, password=password)
    user_in_db = user.create(db=db, obj_in=user_in)
    return user_in_db


def authentication_token_from_email(
    *, client: TestClient, email: str, db: Session
) -> Dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string()
    user_in_db = user.get_by_email(db, email=email)
    if not user_in_db:
        user_in_create = UserCreate(username=email, email=email, password=password)
        user_in_db = user.create(db, obj_in=user_in_create)
    else:
        user_in_update = UserUpdate(password=password)
        user_in_db = user.update(db, db_obj=user_in_db, obj_in=user_in_update)

    return user_authentication_headers(client=client, email=email, password=password)
