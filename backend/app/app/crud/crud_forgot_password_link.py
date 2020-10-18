from typing import Optional
from sqlalchemy.orm import Session
from app.crud import (
    CRUDBase,
    user
)
from app.models import (
    Forgot_Password_Link,
    User
)

from app.schemas import (
    ForgotPasswordLinkForm,
    ForgotPasswordLinkCreate,
    ForgotPasswordLinkUpdate
)
from datetime import (
    datetime,
    timedelta
)
from app.core import settings
from app.utils import (
    generate_new_uuid4_value,
    send_new_registration_link_email,
    send_new_forgot_password_link_email
)
import logging


class CRUDForgotPasswordLink(
    CRUDBase[
        Forgot_Password_Link,
        ForgotPasswordLinkCreate,
        ForgotPasswordLinkUpdate
        ]
):
    def get(self, db: Session, fk_user: int) -> Optional[Forgot_Password_Link]:
        query = db.query(Forgot_Password_Link)
        query = query.filter(Forgot_Password_Link.fk_user == fk_user)
        res = query.first()
        return res

    def get_by_value(
        self,
        db: Session,
        value: str
    ) -> Optional[Forgot_Password_Link]:
        query = db.query(Forgot_Password_Link)
        query = query.filter(Forgot_Password_Link.value == value)
        res = query.first()
        return res

    def generate_and_insert(
        self,
        db: Session,
        itemForm: ForgotPasswordLinkForm
    ) -> Forgot_Password_Link:

        user_in_db = user.get_by_email(db, email=itemForm.user_mail)

        forgot_password_link_tmp = ForgotPasswordLinkCreate(
            fk_user=user_in_db.id,
            value=generate_new_uuid4_value(),
            creation_date=datetime.now()
        )

        forgot_password_link_in_db = self.get(db=db, fk_user=user_in_db.id)
        if forgot_password_link_in_db is not None:
            db.delete(forgot_password_link_in_db)
            db.commit()

        new_forgot_password_link = self.create(
            db=db,
            obj_in=forgot_password_link_tmp
        )

        if settings.EMAILS_ENABLED:

            send_new_forgot_password_link_email(
                email_to=user_in_db.email,
                full_name=user_in_db.full_name,
                link=new_forgot_password_link.value,
                dateCreation=new_forgot_password_link.creation_date
            )

        return new_forgot_password_link


forgot_password_link = CRUDForgotPasswordLink(Forgot_Password_Link)
