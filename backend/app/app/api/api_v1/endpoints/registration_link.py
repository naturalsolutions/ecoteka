from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from app.crud import (
    user,
    registration_link
)
from app.models import (
    User
)
from app.schemas import (
    RegistrationLinkCreate,
    RegistrationLinkUpdate
)
from app.api import (
    get_db,
    get_current_user
)
from sqlalchemy.orm import Session
from datetime import (
    datetime,
    timedelta
)
from app.utils import generate_new_uuid4_value
from app.core import settings
from app.worker import (
    generate_and_insert_registration_link_task
)

router = APIRouter()


@router.get("/verification/{activation_link_value}")
def verification(
    activation_link_value: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    registration_link_in_db = registration_link.validate(
        db=db,
        value=activation_link_value,
        current_user=current_user
    )

    if registration_link_in_db == "you can't validate this link":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="you can't validate this link"
        )

    if registration_link_in_db is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This link is no more usable please regenerate a new one"
        )

    db.delete(registration_link_in_db)
    db.commit()
    return {
        "message": "Your account is validated"
    }


@router.get("/regenerate/", status_code=200)
def regenerate_registration_link(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user.is_verified(current_user):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User is verified"
        )

    registration_link_in_db = registration_link.get(
        db=db,
        fk_user=current_user.id,
    )

    if registration_link_in_db is not None:
        dateLimitBeforeResendMail = (
            registration_link_in_db.creation_date
            +
            timedelta(
                hours=settings.EMAIL_REGISTRATION_LINK_BEFORE_NEW_IN_HOURS
            )
        )
        curDate = datetime.now()

        if dateLimitBeforeResendMail > curDate:
            timeToWait = dateLimitBeforeResendMail - curDate
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"You have to wait {timeToWait} before asking a new registration link"
            )

        db.delete(registration_link_in_db)
        db.commit()

    registration_link.generate_and_insert(db=db, fk_user=current_user.id)


    # generate_and_insert_registration_link_task(current_user.id)

    return {
        'message': 'You will receive a mail with a new registration link'
    }
