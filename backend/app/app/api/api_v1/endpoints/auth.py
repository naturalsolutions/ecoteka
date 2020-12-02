import slug
from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

# rom app import crud, models, schemas
from app.crud import organization, user
from app.models import User
from app.schemas import (
    AccessToken,
    Msg,
    OrganizationCreate,
    RefreshToken,
    RefreshTokenIn,
    UserCreate,
    UserOut,
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
from app.utils import (
    generate_password_reset_token,
    send_reset_password_email,
    verify_password_reset_token,
)
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

@app.post('/refresh_token')
def refresh(Authorize: AuthJWT = Depends()):
    """
    Renew expired acces_token with refresh_token
    """
    Authorize.jwt_refresh_token_required()

    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    return {"access_token": new_access_token, "token_type": "Bearer"}


@router.post("/login/test-token", response_model=UserOut)
def test_token(current_user: User = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/password-recovery/{email}", response_model=Msg)
def recover_password(email: str, db: Session = Depends(get_db)) -> Any:
    """
    Password Recovery
    """
    user_in_db = user.get_by_email(db, email=email)

    if not user_in_db:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    send_reset_password_email(
        email_to=user_in_db.email, email=email, token=password_reset_token
    )
    return {"msg": "Password recovery email sent"}


@router.post("/reset-password/", response_model=Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db),
) -> Any:
    """
    Reset password
    """
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user_in_db = user.get_by_email(db, email=email)
    if not user_in_db:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    hashed_password = get_password_hash(new_password)
    user_in_db.hashed_password = hashed_password
    db.add(user_in_db)
    db.commit()
    return {"msg": "Password updated successfully"}


@router.post("/register/")
def register_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(get_current_user_if_is_superuser),
) -> UserOut:
    user_in_db = user.get_by_email(db, email=user_in.email)

    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system.",
        )

    ## Users should not be matched to organization during registration
    # organization_user = organization.get_by_name(db, name=user_in.organization)

    # if not organization_user:
    #     organization_user_in = OrganizationCreate(
    #         name=user_in.organization,
    #         slug=slug.slug(user_in.organization)
    #     )
    #     organization_user = organization.create(
    #         db=db,
    #         obj_in=organization_user_in)

    # user_in.organization_id = organization_user.id
    user_in_db = user.create(db, obj_in=user_in)

    if not (user_in_db):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something goes wrong",
        )

    send_new_registration_email_task.delay(
        user_in.email, user_in.full_name, user_in.password
    )

    generate_and_insert_registration_link_task.delay(user_in_db.id)

    return {"msg": "user created"}
    # return generate_access_token_and_refresh_token_response(
    #     user_id=user_in_db.id,
    #     is_superuser=user_in_db.is_superuser
    # )
