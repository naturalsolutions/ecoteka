from typing import Optional
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
from app.crud import (
    CRUDBase,
    user
)
from app.models import (
    Registration_Link,
    User
)

from app.schemas import (
    RegistrationLinkCreate,
    RegistrationLinkUpdate
)
from datetime import (
    datetime,
    timedelta
)
from app.core import settings
from app.utils import (
    generate_registration_link_value,
    send_new_registration_link_email
)
import logging


class CRUDRegistrationLink(
    CRUDBase[
        Registration_Link,
        RegistrationLinkCreate,
        RegistrationLinkUpdate
        ]
):
    def get(self, db: Session, fk_user: int) -> Optional[Registration_Link]:
        query = db.query(Registration_Link)
        query = query.filter(Registration_Link.fk_user == fk_user)
        res = query.first()
        return res

    def validate(
        self,
        db: Session,
        value: str,
        current_user: User
    ) -> Optional[Registration_Link]:

        query = db.query(Registration_Link)
        query = query.filter(
            Registration_Link.fk_user == current_user.id,
            Registration_Link.value == value
        )
        registration_link_in_db = query.first()
        if registration_link_in_db is not None:
            logging.info("registration link ok")
            dateExpiration = (
                registration_link_in_db.creation_date
                +
                timedelta(
                    hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS
                )
            )
            curDate = datetime.now()
            logging.info(f"date expirtaion: {dateExpiration}")
            logging.info(f"date current: {curDate}")
            if curDate < dateExpiration:
                logging.info("date ok we validate it")
                user.update(
                    db=db,
                    db_obj=current_user,
                    obj_in={'is_verified': True}
                )
        else:
            logging.info("bla bla bla bla not valid")
            # handle case when expired ?
            registration_link_in_db = None
        return registration_link_in_db

    def generate_and_insert(
        self,
        db: Session,
        fk_user: int,
        background_tasks: BackgroundTasks
    ) -> Registration_Link:
        user_in_db = user.get(db=db, id=fk_user)
        registration_link_tmp = RegistrationLinkCreate(
            fk_user=fk_user,
            value=generate_registration_link_value(),
            creation_date=datetime.now()
        )
        new_registration_link = self.create(
            db=db,
            obj_in=registration_link_tmp
        )
        db.add(new_registration_link)
        db.commit()
        db.refresh(new_registration_link)

        if settings.EMAILS_ENABLED:
            background_tasks.add_task(
                send_new_registration_link_email,
                email_to=user_in_db.email,
                full_name=user_in_db.full_name,
                link=new_registration_link.value
            )
        return new_registration_link


registration_link = CRUDRegistrationLink(Registration_Link)
