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
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

# from app import crud, models, schemas
from app.schemas import (
    UserCreate,
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
    get_current_active_user,
    get_current_active_superuser
)
from app.core.config import settings
from app.utils import send_new_account_email

router = APIRouter()


@router.get("/", response_model=List[UserOut])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
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
    current_user: User = Depends(get_current_active_superuser),
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
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    user_in_db = user.update(db, db_obj=current_user, obj_in=user_in)
    return user_in_db


@router.get("/me", response_model=UserOut)
def read_user_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.post("/open", response_model=UserOut)
def create_user_open(
    *,
    db: Session = Depends(get_db),
    password: str = Body(...),
    email: EmailStr = Body(...),
    full_name: str = Body(None),
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user_in_db = user.get_by_email(db, email=email)
    if user_in_db:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    user_in = UserCreate(password=password, email=email, full_name=full_name)
    user_in_db = user.create(db, obj_in=user_in)
    return user_in_db


@router.get("/{user_id}", response_model=UserOut)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
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
    current_user: User = Depends(get_current_active_superuser),
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
