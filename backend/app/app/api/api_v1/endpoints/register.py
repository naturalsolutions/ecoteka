from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status
)
from sqlalchemy.orm import (
    Session
)
from app.schemas import (
    UserCreate,
    UserOut,
    Token
)
from app.models import (
    User
)
from app.crud import (
    user,
    registration_link
)
from app.api import (
    get_db,
    get_current_user_if_is_superuser
)
from app.utils import (
    generate_response_for_token,
    send_new_registration_email
)

router = APIRouter()


@router.post("/register/", response_model=Token)
def register_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(get_current_user_if_is_superuser),
    background_tasks: BackgroundTasks
) -> UserOut:
    user_in_db = user.get_by_email(db, email=user_in.email)
    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system.",
        )
    user_in_db = user.create(db, obj_in=user_in)

    if not (user_in_db):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something goes wrong",
        )

    background_tasks.add_task(
        send_new_registration_email,
        email_to=user_in.email,
        full_name=user_in.full_name,
        password=user_in.password
    )

    background_tasks.add_task(
        registration_link.generate_and_insert,
        db=db,
        fk_user=user_in_db.id,
        background_tasks=background_tasks
    )

    return generate_response_for_token(
        user_id=user_in_db.id,
        is_superuser=user_in_db.is_superuser
    )
