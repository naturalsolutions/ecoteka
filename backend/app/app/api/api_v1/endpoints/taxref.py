from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.api import get_db
from app.core import get_current_user
from app.crud import taxref
from app.models.taxref import Taxref
from app.schemas.taxref import TaxrefForTreesOut, TaxrefOut


router = APIRouter()


@router.get(
    "",
    response_model=List[TaxrefOut],
    dependencies=[Depends(get_current_user)],
)
async def read_taxrefs(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100
) -> List[Taxref]:
    return taxref.get_multi(db=db, skip=skip, limit=limit)


@router.get(
    "/trees",
    response_model=List[TaxrefForTreesOut],
    dependencies=[Depends(get_current_user)],
)
async def read_taxrefs_trees(
    db: Session = Depends(get_db),
) -> List[TaxrefForTreesOut]:
    return taxref.get_trees(db=db)


@router.get(
    "/{CD_NOM}",
    response_model=TaxrefOut,
    dependencies=[Depends(get_current_user)],
)
async def read_taxref(
    CD_NOM: int,
    db: Session = Depends(get_db),
) -> Taxref:
    taxref_in_db = taxref.get(db=db, id=CD_NOM)
    if not taxref_in_db:
        raise HTTPException(
            status_code=404,
            detail="The taxon with this id does not exist in the system",
        )
    return taxref_in_db
