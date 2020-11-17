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
    get_db
)
from sqlalchemy.orm import Session
from datetime import (
    datetime,
    timedelta
)
from app.utils import generate_registration_link_value
from app.core import (
    settings,
    get_current_user
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


@router.get("/regenerate/")
def regenerate_registration_link(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if user.is_verified(current_user):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User is verified"
        )
    else:
        print("oopps pas verifié et pas de reg en base")
        registration_link_in_db = registration_link.get(
            db=db,
            fk_user=current_user.id,
        )
        if registration_link_in_db is None:
            registration_link_tmp = RegistrationLinkCreate(
                fk_user=current_user.id,
                value=generate_registration_link_value(),
                creation_date=datetime.datetime.now()
            )
            new_registration_link = registration_link.create(
                db=db,
                obj_in=registration_link_tmp
            )
            # send email
        else:
            dateExpiration = (
                registration_link_in_db.creation_date
                +
                timedelta(
                    days=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS
                )
            )
            dateLimitBeforeResendMail = (
                registration_link_in_db.creation_date
                +
                timedelta(hours=2)
            )
            curDate = datetime.now()
            if dateExpiration < curDate:
                registration_link_tmp = RegistrationLinkUpdate(
                    fk_user=current_user.id,
                    value=generate_registration_link_value(),
                    creation_date=datetime.datetime.now()
                )
                new_registration_link = registration_link.update(
                    db=db,
                    obj_in=registration_link_tmp
                )
                # resend mail
                pass
            elif dateLimitBeforeResendMail < curDate:
                registration_link_tmp = RegistrationLinkUpdate(
                    fk_user=current_user.id,
                    value=generate_registration_link_value(),
                    creation_date=datetime.datetime.now()
                )
                new_registration_link = registration_link.update(
                    db=db,
                    obj_in=registration_link_tmp
                )
                # resend mail
            else:
                new_registration_link = registration_link_in_db
                # naaa just resend the mail

    mail = (
        'your registration link will be send by mail',
        f'value : {new_registration_link.value}',
        f'obj : {new_registration_link}'
    )
    return {
        mail
    }
