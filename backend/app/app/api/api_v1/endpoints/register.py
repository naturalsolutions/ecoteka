import slug
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from sqlalchemy.orm import (
    Session
)
from app.schemas import (
    OrganizationCreate,
    UserCreate,
    UserOut,
    Token
)
from app.models import (
    Organization,
    User
)
from app.crud import (
    organization,
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
from app.worker import send_new_registration_email_task, generate_and_insert_registration_link_task

router = APIRouter()


@router.post("/register/", response_model=Token)
def register_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(get_current_user_if_is_superuser)
) -> UserOut:
    user_in_db = user.get_by_email(db, email=user_in.email)

    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system.",
        )

    organization_user = organization.get_by_name(db, name=user_in.organization)

    if not organization_user:
        organization_user_in = OrganizationCreate(
            name=user_in.organization,
            slug=slug.slug(user_in.organization)
        )
        organization_user = organization.create(db, obj_in=organization_user_in)

    user_in.organization_id = organization_user.id
    user_in_db = user.create(db, obj_in=user_in)

    if not (user_in_db):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something goes wrong",
        )

    send_new_registration_email_task.delay(
        user_in.email,
        user_in.full_name,
        user_in.password
    )

    generate_and_insert_registration_link_task.delay(user_in.id)

    return generate_response_for_token(
        user_id=user_in_db.id,
        is_superuser=user_in_db.is_superuser
    )
