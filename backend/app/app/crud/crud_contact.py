from app.crud import CRUDBase
from app.models import Contact
from app.schemas import (
    ContactCreate,
    ContactUpdate
)


class CRUDContact(CRUDBase[Contact, ContactCreate, ContactUpdate]):
    pass


contact = CRUDContact(Contact)
