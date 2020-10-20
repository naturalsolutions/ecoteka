from typing import (
    Any,
    List
)

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.schemas import (
    UserCreate,
    UserMeOut,
    UserOut,
    UserUpdate
)
from app.models import (
    User
)
from app.crud import (
    user
)
from app.api import (
    get_db,
    get_current_user,
    get_current_user_if_is_superuser
)
from app.utils import (
    send_new_account_email
)
from app.core import (
    settings,
    get_password_hash,
    verify_password
)

router = APIRouter()


@router.get("/", response_model=List[UserOut])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: User = Depends(get_current_user_if_is_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = user.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=UserOut)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(get_current_user_if_is_superuser),
) -> Any:
    """
    Create new user.
    """
    user_in_db = user.get_by_email(db, email=user_in.email)
    if user_in_db:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user_in_db = user.create(db, obj_in=user_in)
    if settings.EMAILS_ENABLED and user_in.email:
        send_new_account_email(
            email_to=user_in.email,
            username=user_in.email,
            password=user_in.password
        )
    return user_in_db


@router.put("/me", response_model=UserOut)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    full_name: str = Body(None),
    organization_id: int = Body(None),
    old_password: str = Body(None),
    new_password: str = Body(None),
    new_confirm_password: str = Body(None),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update own user.
    """
    send_mail_new_password = False
    current_user_data = UserOut.from_orm(current_user)
    user_in = UserUpdate(**current_user_data.dict())
    if old_password is not None:
        hashed_password = get_password_hash(old_password)
        if verify_password(old_password, hashed_password) is False:
            raise HTTPException(
                status_code=400,
                detail="Password is wrong",
            )
        if new_password != new_confirm_password:
            raise HTTPException(
                status_code=400,
                detail="New password are note are not the same",
            )

        user_in.password = new_password
        send_mail_new_password = True

    if full_name is not None:
        user_in.full_name = full_name
    if organization_id is not None:
        user_in.organization_id = organization_id
    user_in_db = user.update(db, db_obj=current_user, obj_in=user_in)

    if send_mail_new_password is True:
        pass  # TODO send new password mail

    return user_in_db


@router.get("/me", response_model=UserMeOut)
def read_user_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    me = user.me(db, id=current_user.id)
    return me


@router.get("/{user_id}", response_model=UserOut)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user_in_db = user.get(db, id=user_id)
    if user_in_db == current_user:
        return user_in_db
    if not user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user_in_db


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user_if_is_superuser),
) -> Any:
    """
    Update a user.
    """
    user_in_db = user.get(db, id=user_id)
    if not user_in_db:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user_in_db = user.update(db, db_obj=user, obj_in=user_in)
    return user_in_db
