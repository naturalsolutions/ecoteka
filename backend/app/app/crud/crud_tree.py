from app.crud.base import CRUDBase
from app.models import Tree
from app.schemas import TreeCreate, TreeUpdate


class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    pass


tree = CRUDTree(Tree)
