from fastapi import (
    Depends,
    HTTPException,
    status
)
from fastapi.security import OAuth2PasswordBearer
from fastapi_jwt_auth import AuthJWT
from pydantic.typing import Optional
from sqlalchemy.orm import Session
from app.core import (
    settings,
    verify_password,
    get_password_hash
)
from app.api import get_db

from app.schemas import TokenPayload
from app.models import User
from app.crud import user


token_url = f"{settings.ROOT_PATH}/auth/login"

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=token_url
)


@AuthJWT.load_config
def get_config():
    return settings


def generate_refresh_token_response(
    user_id: int,
    is_superuser: bool,
    # Authorize: AuthJWT = Depends()
):
    Authorize = AuthJWT()
    user_claims = {
        'is_superuser': is_superuser
    }

    # refresh_token = Authorize.create_refresh_token(
    #     subject=str(user_id),
    #     user_claims=user_claims
    # )
    access_token = Authorize.create_access_token(
        subject=str(user_id),
        user_claims=user_claims
    )
    return {
        'access_token': access_token,
        "token_type": "Bearer"
    }
    # logging.info(f"refresh: {refresh_token}")
    # return {
    #     'refresh_token': refresh_token,
    #     "token_type": "Bearer"
    # }


def get_current_user(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: str = Depends(reusable_oauth2)
) -> User:
    Authorize.jwt_required(token=token)
    current_user_id = Authorize.get_jwt_subject()
    user_in_db = user.get(db, id=current_user_id)

    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user_in_db


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_verified(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user account is not verified"
        )
    return current_user


def get_current_user_if_is_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user


reusable_oauth2_optional = OAuth2PasswordBearer(
    tokenUrl=token_url,
    auto_error=False
)


def get_optional_current_active_user(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: Optional[str] = Depends(reusable_oauth2_optional)
) -> Optional[User]:
    if token is not None:
        Authorize.jwt_required(token=token)
        current_user_id = Authorize.get_jwt_subject()
        user_in_db = user.get(db, id=current_user_id)
        if user_in_db is not None:
            return user_in_db

    return None
