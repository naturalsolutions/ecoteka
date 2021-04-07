from fastapi import Request
from oso import Oso
from sqlalchemy_oso import register_models, set_get_session
from sqlalchemy_oso.roles import enable_roles
from app.db.base import Base 
from app.db.session import SessionLocal
from app.core import settings

def init_oso():
    oso = Oso()

    register_models(oso, Base)
    set_get_session(oso, lambda: SessionLocal)
    enable_roles(oso)

    oso.load_file(settings.POLICIES_FOLDER / "main.polar")


    # OSO_POLICIES=[settings.POLICIES_FOLDER / "main.polar"]
    # for policy in OSO_POLICIES:
    #     oso.load_file(policy)

    return oso