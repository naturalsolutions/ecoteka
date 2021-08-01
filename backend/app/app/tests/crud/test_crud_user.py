import pytest

from app.models.user import User
from app.crud import crud_user
from app.schemas.user import UserCreate, UserUpdate
from app.core.dependencies import verify_password

@pytest.fixture(scope="function", autouse=True)
def remove_data(db):
    db.query(User).delete()
    db.commit()

def test_create(db, faker):
    obj_in = UserCreate(
        full_name=faker.name(),
        email=faker.email(),
        password=faker.password()
    ) 

    user = crud_user.user.create(db, obj_in=obj_in)

    assert user.email == obj_in.email
    assert user.full_name == obj_in.full_name
    assert verify_password(obj_in.password, user.hashed_password)

def test_get_by_email(db, create_user):
    user_a = create_user()
    user_b = crud_user.user.get_by_email(db, email=user_a.email)

    assert user_a == user_b

def test_get_multi(db, create_user):
    users_a = [create_user(), create_user()]
    users_b = crud_user.user.get_multi(db)

    assert users_a == users_b

def test_update(db, create_user, faker):
    user = create_user()
    obj_in = {
        "full_name": faker.name()
    }
    updated_user = crud_user.user.update(db, db_obj=user, obj_in=obj_in)
    assert updated_user.full_name == obj_in["full_name"]

    obj_in = UserUpdate(
        password=faker.password()
    )
    updated_user = crud_user.user.update(db, db_obj=user, obj_in=obj_in)
    assert verify_password(obj_in.password, updated_user.hashed_password)

def test_authenticate(db, faker):
    obj_in = UserCreate(
        full_name=faker.name(),
        email=faker.email(),
        password=faker.password()
    ) 

    user = crud_user.user.create(db, obj_in=obj_in)

    assert crud_user.user.authenticate(db, email=user.email, password=obj_in.password) == user
    assert crud_user.user.authenticate(db, email="no user", password=obj_in.password) == None
    assert crud_user.user.authenticate(db, email=user.email, password="no password") == None