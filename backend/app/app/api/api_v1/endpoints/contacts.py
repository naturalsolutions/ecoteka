from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_contact_request_confirmation

router = APIRouter()

@router.post("/",response_model=schemas.Contact)
def post_contact_request(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: schemas.ContactCreate #provided contact info from the http.post
) -> Any:
    """Submits a contact request"""
    contact = crud.contact.create(db, obj_in=contact_in)

    send_contact_request_confirmation(
        email_to=contact.email,
        first_name=contact.first_name,
        last_name=contact.last_name
    )

    return contact