from typing import Any, List

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Body,
    Depends,
    HTTPException
)
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_contact_request_confirmation

router = APIRouter()


@router.post("/", response_model=schemas.Contact)
async def post_contact_request(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: schemas.ContactCreate,  # provided contact info from the http.post
    background_tasks: BackgroundTasks
) -> Any:
    """Submits a contact request"""
    contact = crud.contact.create(db, obj_in=contact_in)

    background_tasks.add_task(
        send_contact_request_confirmation,
        email_to=contact.email,
        first_name=contact.first_name,
        last_name=contact.last_name
    )

    return contact
