from typing import (
    Any,
    List
)

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session

from app.models import (
    User
)
from app.schemas import (
    LanguageOut
)
from app.api import (
    get_db,
    get_current_user
)
from app.crud import (
    language
)

router = APIRouter()


@router.get("/", response_model=List[LanguageOut])
def read_languages(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: User = Depends(get_current_user),
) -> Any:
    languages = language.get_multi(db, skip=skip, limit=limit)
    return languages


@router.get("/{language_id}", response_model=LanguageOut)
def read_language_by_id(
    language_id: str,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user),
) -> Any:
    language_in_db = language.get(db, id=language_id)
    if not language_in_db:
        raise HTTPException(
            status_code=404,
            detail=f"The language with this id: {language_id} does not exist in the system",
        )
    return language_in_db
