from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from app.crud import (
    user,
    forgot_password_link
)
from app.models import (
    User,
    Forgot_Password_Link
)
from app.schemas import (
    ForgotPasswordLinkForm,
    ForgotPasswordLinkCreate,
    ForgotPasswordChangeForm
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
from app.core import (
    celery_app,
    settings
)
# from app.worker import (
#     generate_and_insert_registration_link_task,
#     send_confirmation_password_changed
# )

router = APIRouter()


@router.post("/generate/", status_code=200)
def generate_new_forgot_password_link(
    itemForm: ForgotPasswordLinkForm,
    db: Session = Depends(get_db)
):
    user_in_db = user.get_by_email(db, email=itemForm.email)

    if user_in_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This user {itemForm.email} is not found"
        )

    forgot_password_link.generate_and_insert(db=db, itemForm=itemForm)

    # celery_app.generate_and_insert_registration_link_task.delay(user_in_db.id)

    return {
        "message": "your will receive a mail with a link to change your password"
    }


@router.post("/{value}", status_code=200)
def use_forgot_password_link_for_update_password(
    value: str,
    passwordChangeForm: ForgotPasswordChangeForm,
    db: Session = Depends(get_db)
):
    def cleanLinkInDb(db: Session, dbObj: Forgot_Password_Link):
        db.delete(dbObj)
        db.commit()

    forgot_password_link_in_db = forgot_password_link.get_by_value(db=db, value=value)

    if forgot_password_link_in_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This link {value} is not found"
        )

    curDate = datetime.now()
    dateLimit = (
        forgot_password_link_in_db.creation_date
        +
        timedelta(hours=settings.EMAIL_FORGOT_PASSWORD_LINK_EXPIRE_HOURS)
    )
    linkHasExpired = (dateLimit < curDate)
    if linkHasExpired:
        cleanLinkInDb(db=db, dbObj=forgot_password_link_in_db)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The link has expired please ask a new one"
        )

    samePassword = (
        passwordChangeForm.new_password
        ==
        passwordChangeForm.confirm_new_password
    )
    if not samePassword:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Passwords are not the same"
        )

    user_in_db = user.get(
        db=db,
        id=forgot_password_link_in_db.fk_user
    )
    obj_in = {"password": passwordChangeForm.new_password}
    user.update(db=db, db_obj=user_in_db, obj_in=obj_in)
    cleanLinkInDb(db=db, dbObj=forgot_password_link_in_db)

    # celery_app.send_confirmation_password_changed.delay(user_in_db.id)

    return {"message": "Your password has been changed"}