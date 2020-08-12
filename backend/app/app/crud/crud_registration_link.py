from typing import Optional
from sqlalchemy.orm import Session

from app.crud import (
    CRUDBase,
    user
)
from app.models import (
    Registration_Link,
    User
)

from app.schemas.registration_link import (
    RegistrationLinkCreate,
    RegistrationLinkUpdate
)
from datetime import (
    datetime,
    timedelta
)
from app.core.config import settings


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
        query = query.filter((
            Registration_Link.fk_user == current_user.id,
            Registration_Link.value == value
            )
        )
        registration_link_in_db = query.first()
        if registration_link_in_db is not None:
            dateExpiration = (
                registration_link_in_db.creation_date
                +
                timedelta(
                    days=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS
                )
            )
            curDate = datetime.now()
            if dateExpiration < curDate:
                user.update(
                    db=db,
                    db_obj=current_user,
                    ob_in={'is_verified': True}
                )
        else:
            # handle case when expired ?
            registration_link_in_db = None
        return registration_link_in_db


registration_link = CRUDRegistrationLink(Registration_Link)
