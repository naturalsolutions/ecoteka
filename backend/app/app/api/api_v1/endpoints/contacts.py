from typing import Any
from fastapi import (
    APIRouter,
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
from app.worker import (
    send_contact_request_confirmation_task,
    send_new_contact_notification_task
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
) -> Any:
    """Submits a contact request"""
    contact_in_db = contact.create(db, obj_in=contact_in)

    send_contact_request_confirmation_task.delay(contact_in_db.id)
    send_new_contact_notification_task.delay(contact_in_db.id)

    return contact_in_db
