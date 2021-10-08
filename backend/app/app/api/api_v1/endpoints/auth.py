from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

# rom app import crud, models, schemas
from app.crud import user
from app.models import User
from app.schemas import (
    AccessToken,
    Msg,
    UserCreate,
    AccessAndRefreshToken,
)
from app.api import get_db
from app.core import (
    get_current_user,
    get_password_hash,
    generate_access_token_and_refresh_token_response,
    get_current_user_if_is_superuser,
    get_current_user_with_refresh_token,
)
from app.utils import send_reset_password_email
from app.worker import (
    send_new_registration_email_task,
    generate_and_insert_registration_link_task,
)
import logging


router = APIRouter()


@router.post("/login", response_model=AccessAndRefreshToken)
def login_and_get_refresh_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user_in_db = user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user_in_db:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    return generate_access_token_and_refresh_token_response(
        user_id=user_in_db.id, is_superuser=user_in_db.is_superuser
    )


@router.post("/access_token", response_model=AccessToken)
def get_access_token(
    current_user: User = Depends(get_current_user_with_refresh_token),
    Authorize: AuthJWT = Depends(),
):
    logging.info(f"token authorization find : {current_user}")

    access_token = Authorize.create_access_token(subject=current_user.id, fresh=False)

    return {"access_token": access_token, "token_type": "Bearer"}


@router.post("/refresh_token", response_model=AccessAndRefreshToken)
def get_refresh_token(
    current_user: User = Depends(get_current_user_with_refresh_token),
    Authorize: AuthJWT = Depends(),
):
    """
    Renew expired acces_token with refresh_token
    """
    Authorize.jwt_refresh_token_required()

    logging.info(f"refresh_token user find : {current_user}")
    return generate_access_token_and_refresh_token_response(
        user_id=current_user.id, is_superuser=current_user.is_superuser
    )


@router.post("/password-recovery/{email}", response_model=Msg)
def password_recovery(email: str, db: Session = Depends(get_db)) -> Any:
    """
    Password Recovery
    """

    user_in_db = user.get_by_email(db, email=email)

    if user_in_db:
        tokens = generate_access_token_and_refresh_token_response(
            user_id=user_in_db.id, is_superuser=user_in_db.is_superuser
        )

        send_reset_password_email(
            email_to=user_in_db.email,
            username=user_in_db.full_name,
            token=tokens["access_token"],
        )

        return {"msg": "Password recovery email sent"}
    else:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )


@router.post("/reset-password", response_model=Msg)
def reset_password(
    new_password: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Reset Password
    """
    hashed_password = get_password_hash(new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    db.commit()

    return {"msg": "Password updated successfully"}


@router.post(
    "/register",
    response_model=Msg,
    dependencies=[Depends(get_current_user_if_is_superuser)],
)
def register_new_user(*, db: Session = Depends(get_db), user_in: UserCreate):
    user_in_db = user.get_by_email(db, email=user_in.email)

    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system.",
        )

    user_in_db = user.create(db, obj_in=user_in)

    send_new_registration_email_task.delay(
        user_in.email, user_in.full_name, user_in.password
    )

    generate_and_insert_registration_link_task.delay(user_in_db.id)

    return {"msg": "User created"}
