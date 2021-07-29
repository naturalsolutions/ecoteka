from typing import Dict, Optional
import pytest

from app.core.security import generate_access_token_and_refresh_token_response
from app.models.user import User
from app.schemas.user import UserCreate
from app.crud import crud_user

@pytest.fixture
def generate_user_data(faker):
    def decorator_generate_user_data(
        email: Optional[str] = None,
        full_name: Optional[str] = None,
        password: str = "password"
    ):
        if email is None:
            email = faker.unique.email()
        
        if full_name is None:
            full_name = faker.unique.name()
       
        return {
            "email": email,
            "full_name": full_name,
            "password": password
        }
    return decorator_generate_user_data

@pytest.fixture
def create_user(
    db, 
    generate_user_data
):
    def decorator_create_user(
        password: str = "password",
        is_superuser: bool = False
    ) -> User:
        user_data = generate_user_data(password=password)
        obj_in = UserCreate(**user_data)
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
        auth = {
            "headers": headers,
            "user": user
        }
        
        return auth
    
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

@pytest.fixture
def delete_user(db, delete_user_casbin):
    def decorator_delete_user(
        user_id: int
    ) -> None:
        crud_user.user.remove(db, id=user_id)
        delete_user_casbin(user_id)
    
    return decorator_delete_user

@pytest.fixture
def delete_user_casbin(enforcer):
    def decorator_delete_user_casbin(
        user_id: int
    ) -> None:
        enforcer.delete_user(str(user_id))
        enforcer.load_policy()
    
    return decorator_delete_user_casbin