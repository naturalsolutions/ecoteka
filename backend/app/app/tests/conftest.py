import os
from typing import Any, Dict, Generator
import pytest

from fastapi.testclient import TestClient
from sqlalchemy_utils import create_database, database_exists, drop_database

from alembic import command
from alembic.config import Config
from app.main import app
from app.db.base import Base  # noqa
from app.api.deps import get_db, get_enforcer
from app.db.init_db import init_db
from app.tests.utils.overrides import override_get_db, override_get_enforcer
from app.tests.utils.test_db import TestingSessionLocal, engine
from app.tests.utils.utils import (get_superuser_access_token_headers,
                                   get_superuser_refresh_token_headers)

app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    if database_exists(engine.url):
        drop_database(engine.url)
    create_database(
        engine.url, template="template_postgis"
    )  # Create the test database.

    p = os.path.join(os.getcwd(), "alembic.ini")
    m = os.path.join(os.getcwd(), "alembic")
    alembic_config = Config(p)  # Run the migrations.
    alembic_config.set_main_option("script_location", m)
    alembic_config.attributes["configure_logger"] = False

    with engine.begin() as session:
        alembic_config.attributes["connection"] = session
        command.upgrade(alembic_config, "head")
    session = next(app.dependency_overrides[get_db]())  

@pytest.fixture(scope="session", autouse=True)
def init_database():
    app.dependency_overrides[get_enforcer] = override_get_enforcer
    session = next(app.dependency_overrides[get_db]())
    enforcer = next(app.dependency_overrides[get_enforcer]())
    init_db(session, enforcer)


@pytest.fixture()
def db() -> Generator:
    yield TestingSessionLocal()

@pytest.fixture()
def enforcer() -> Generator:
    enforcer = next(app.dependency_overrides[get_enforcer]())
    yield enforcer



@pytest.fixture(scope="module")
def client() -> Generator[TestClient, Any, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_access_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_access_token_headers(client)


@pytest.fixture(scope="module")
def superuser_refresh_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_refresh_token_headers(client)

pytest_plugins = [
    "app.tests.utils.security",
    "app.tests.fixtures.tree",
    "app.tests.fixtures.intervention",
    "app.tests.fixtures.image"
]