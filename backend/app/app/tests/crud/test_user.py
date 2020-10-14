from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

# from app import crud
from app.crud import user
from app.core.security import verify_password
from app.schemas import (
    UserCreate,
    UserUpdate
)
from app.tests.utils.utils import random_email, random_lower_string


def test_create_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user_in_db = user.create(db, obj_in=user_in)
    assert user_in_db.email == email
    assert hasattr(user_in_db, "hashed_password")


def test_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user_in_db = user.create(db, obj_in=user_in)
    authenticated_user = user.authenticate(
        db,
        email=email,
        password=password
    )
    assert authenticated_user
    assert user_in_db.email == authenticated_user.email


def test_not_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in_db = user.authenticate(db, email=email, password=password)
    assert user_in_db is None


def test_check_if_user_is_verified(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user_in_db = user.create(db, obj_in=user_in)
    is_verified = user.is_verified(user_in_db)
    assert is_verified is True


def test_check_if_user_is_verified_inactive(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, disabled=True)
    user_in_db = user.create(db, obj_in=user_in)
    is_verified = user.is_verified(user_in_db)
    assert is_verified


def test_check_if_user_is_superuser(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user_in_db = user.create(db, obj_in=user_in)
    is_superuser = user.is_superuser(user_in_db)
    assert is_superuser is True


def test_check_if_user_is_superuser_normal_user(db: Session) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    user_in_db = user.create(db, obj_in=user_in)
    is_superuser = user.is_superuser(user_in_db)
    assert is_superuser is False


def test_get_user(db: Session) -> None:
    password = random_lower_string()
    username = random_email()
    user_in = UserCreate(email=username, password=password, is_superuser=True)
    user_in_db = user.create(db, obj_in=user_in)
    user_in_db_2 = user.get(db, id=user_in_db.id)
    assert user_in_db_2
    assert user_in_db.email == user_in_db_2.email
    assert jsonable_encoder(user_in_db) == jsonable_encoder(user_in_db_2)


def test_update_user(db: Session) -> None:
    password = random_lower_string()
    email = random_email()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user_in_db = user.create(db, obj_in=user_in)
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password, is_superuser=True)
    user.update(db, db_obj=user_in_db, obj_in=user_in_update)
    user_in_db_2 = user.get(db, id=user_in_db.id)
    assert user_in_db_2
    assert user_in_db.email == user_in_db_2.email
    assert verify_password(new_password, user_in_db_2.hashed_password)
