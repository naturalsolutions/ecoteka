from typing import Dict, Optional
import pytest
from faker import Faker

from app.core.security import generate_access_token_and_refresh_token_response
from app.models.user import User
from app.schemas.user import UserCreate
from app.crud import crud_user


fake = Faker()

@pytest.fixture
def create_user(db):
    def decorator_create_user(
        password: str = "password",
        is_superuser: bool = False
    ) -> User:
        obj_in = UserCreate(**{
            "email": fake.email(),
            "full_name": fake.name(),
            "password": password
        })

        user = crud_user.user.create(db, obj_in=obj_in)
        user.is_superuser = is_superuser
        db.commit()

        return user

    return decorator_create_user

@pytest.fixture
def auth_user(create_user):
    def decorator_user_headers(
        token_key: str = "access_token",
        user_id: Optional[int] = None, 
        is_superuser: bool = False
    ) -> Dict:
        if user_id is None:
            user = create_user(is_superuser=is_superuser)
            user_id = user.id

        tokens = generate_access_token_and_refresh_token_response(
            user_id=user_id, 
            is_superuser=is_superuser
        )
        token = tokens[token_key]
        headers = {"Authorization": f"Bearer {token}"}
        return {
            "headers": headers,
            "user": user
        }
    return decorator_user_headers

@pytest.fixture
def add_user_to_organization(enforcer):
    def decorator_add_user_to_organization(
        user_id: int,
        organization_id: int, 
        role="owner"
    ) -> None:
        enforcer.add_role_for_user_in_domain(
            str(user_id), 
            role, 
            str(organization_id)
        )
        enforcer.load_policy()
    
    return decorator_add_user_to_organization