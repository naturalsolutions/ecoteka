import casbin
import casbin_sqlalchemy_adapter

from app.tests.utils.test_db import engine

source_file = "/app/app/core/authorization-model.conf"
adapter = casbin_sqlalchemy_adapter.Adapter(engine)
enforcer = casbin.Enforcer(source_file, adapter=adapter)