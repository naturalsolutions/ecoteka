from typing import (
    Any,
    List
)
from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session

from app.schemas import (
    Organization
)
from app.crud import (
    organization
)
from app.api import (
    get_db
)

router = APIRouter()


@router.get("/", response_model=List[Organization])
async def read_users(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """Submits a contact request"""
    organizations = organization.get_multi(db, skip=skip, limit=limit)

    return organizations
