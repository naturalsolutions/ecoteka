from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from app.models import User
from app.schemas import TaxrefForTreesOut, TaxrefOut
from sqlalchemy.orm import Session
from app.api import get_db
from app.core import get_current_active_user
from app.crud import taxref

router = APIRouter()


@router.get("/", response_model=List[TaxrefOut])
async def read_taxrefs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:

    return taxref.get_multi(db=db, skip=skip, limit=limit)


@router.get("/trees", response_model=List[TaxrefForTreesOut])
async def read_taxrefs_trees(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> Any:

    return taxref.get_trees(db=db)


@router.get("/{CD_NOM}", response_model=TaxrefOut)
async def read_taxref(
    CD_NOM: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> TaxrefOut:
    taxref_in_db = taxref.get(db=db, id=CD_NOM)
    if not taxref_in_db:
        raise HTTPException(
            status_code=404,
            detail="The taxon with this id does not exist in the system",
        )
    return taxref_in_db
