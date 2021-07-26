import casbin
import casbin_sqlalchemy_adapter
from app.tests.utils.test_db import TestingSessionLocal, engine

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_get_enforcer():
    source_file = "/app/app/core/authorization-model.conf"
    adapter = casbin_sqlalchemy_adapter.Adapter(engine)
    enforcer = casbin.Enforcer(source_file, adapter=adapter)
    yield enforcer