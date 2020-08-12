from .base import (
    CRUDBase
)
from .crud_user import (
    user
)
from .crud_contact import (
    contact
)
from .crud_registration_link import (
    registration_link
)

__all__ = [
    "user",
    "CRUDBase",
    "contact",
    "registration_link"
]

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)
