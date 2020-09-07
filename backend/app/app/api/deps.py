from typing import Generator

from fastapi import (
    Depends,
    HTTPException,
    status
)
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.crud import (
    user
)
from app.models import (
    User
)
from app.schemas import (
    TokenPayload
)
from app.core import (
    security,
    settings
)
from app.db.session import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.ROOT_PATH}/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user_in_db = user.get(db, id=token_data.sub)
    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")
    return user_in_db


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    # if not crud.user.is_verified(current_user):
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return user.is_verified(current_user)


def get_current_user_if_is_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
