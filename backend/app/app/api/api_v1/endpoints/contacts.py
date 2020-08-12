from typing import Any

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends
)
from sqlalchemy.orm import Session

from app.schemas import (
    Contact,
    ContactCreate
)
from app.crud import (
    contact
)
from app.api import deps
from app.utils import send_contact_request_confirmation

router = APIRouter()


@router.post("/", response_model=Contact)
async def post_contact_request(
    *,
    db: Session = Depends(deps.get_db),
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

    return contact_in_db
