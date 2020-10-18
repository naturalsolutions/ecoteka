from typing import Any, Dict, Optional, Union
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.session import engine
from app.crud.base import CRUDBase
from app.models import Language
from app.schemas import LanguageCreate, LanguageUpdate


class CRUDLanguage(CRUDBase[Language, LanguageCreate, LanguageUpdate]):

    def create(self, db: Session, *, obj_in: LanguageCreate) -> Language:
        db_obj = Language(
            id=obj_in.id,
            label=obj_in.label
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


language = CRUDLanguage(Language)
