from typing import (
    Any,
    Dict,
    List,
    Optional,
    Union
)

from sqlalchemy.orm import (
    Session,
    joinedload
)

from app.core.security import (
    get_password_hash,
    verify_password
)
from app.crud import (
    CRUDBase
)
from app.models import (
    User
)
from app.schemas import (
    UserCreate,
    UserUpdate,
    UserOut
)


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):

    def me(self, db: Session, *, id: int) -> Optional[User]:
        query = db.query(User)
        query = query.filter(User.id == id)
        query = query.options(joinedload(User.organization))
        return query.first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_organization(self, db: Session, *, organization_id: int) -> List[User]:
        return db.query(User).filter(User.organization_id == organization_id)

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            organization_id=obj_in.organization_id,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[UserOut]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def update(
        self,
        db: Session,
        *,
        db_obj: User,
        obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(
        self,
        db: Session,
        *,
        email: str,
        password: str
    ) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_verified(self, user: User) -> bool:
        return user.is_verified

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
