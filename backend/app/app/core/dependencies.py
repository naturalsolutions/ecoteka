from passlib.context import CryptContext
import casbin
import casbin_sqlalchemy_adapter
from app.db.session import engine

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


source_file = "/app/app/core/authorization-model.conf"
adapter = casbin_sqlalchemy_adapter.Adapter(engine)
enforcer: casbin.Enforcer = casbin.Enforcer(source_file, adapter, True)
