from typing import Any

from fastapi import APIRouter, Depends
from pydantic import EmailStr

from app.models import User
from app.schemas import Msg

from app.api import (
    get_current_user_if_is_superuser
)
from app.utils import send_test_email

router = APIRouter()


@router.post("/test-email/", response_model=Msg, status_code=201)
def test_email(
    email_to: EmailStr,
    current_user: User = Depends(get_current_user_if_is_superuser),
) -> Any:
    """
    Test emails.
    """
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}
