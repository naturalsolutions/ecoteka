from .base import CRUDBase
from .crud_user import user
from .crud_geo_file import geo_file
from .crud_tree import tree
from .crud_organization import organization
from .crud_taxref import taxref
from .crud_intervention import intervention
from .crud_health_assessment import health_assessment

__all__ = [
    "CRUDBase",
    "geo_file",
    "organization",
    "taxref",
    "tree",
    "user",
    "intervention",
    "health_assessment"
]

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)
