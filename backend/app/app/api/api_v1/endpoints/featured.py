from typing import List, Optional
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from app.api import get_db
from app.crud.crud_organization import organization
from app.schemas.organization import Organization

router = APIRouter()

@router.get("/organizations", response_model=List[Organization])
def get_featured_open_organizations(
    *,
    db: Session = Depends(get_db),
) -> Optional[List[Organization]]:
    """
    **Public**; Get all featured organizations;
    """
    return organization.get_open_featured(db)