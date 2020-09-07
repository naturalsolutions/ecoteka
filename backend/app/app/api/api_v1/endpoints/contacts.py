from typing import Any
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends
)
from sqlalchemy.orm import Session

from app.schemas import (
    ContactDB,
    ContactCreate
)
from app.crud import (
    contact
)
from app.api import (
    get_db
)
from app.utils import (
    send_contact_request_confirmation,
    send_new_contact_notification
)
from app.core import (
    settings
)

router = APIRouter()


@router.post("/", response_model=ContactDB)
async def post_contact_request(
    *,
    db: Session = Depends(get_db),
    contact_in: ContactCreate,  # provided contact info from the http.post
    background_tasks: BackgroundTasks
) -> Any:
    """Submits a contact request"""
    contact_in_db = contact.create(db, obj_in=contact_in)

    background_tasks.add_task(
        send_contact_request_confirmation,
        email_to=contact_in_db.email,
        first_name=contact_in_db.first_name,
        last_name=contact_in_db.last_name
    )

    background_tasks.add_task(
        send_new_contact_notification,
        email_to=settings.SUPERUSERS_CONTACT_LIST,
        contactId=contact_in_db.id,
        first_name=contact_in_db.first_name,
        last_name=contact_in_db.last_name,
        email=contact_in_db.email,
        phone_number=contact_in_db.phone_number,
        township=contact_in_db.township,
        position=contact_in_db.position,
        contact_request=contact_in_db.contact_request,
    )

    return contact_in_db
