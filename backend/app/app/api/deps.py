from typing import Generator
from contextlib import contextmanager
from app.db.session import SessionLocal


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


dbcontext = contextmanager(get_db)
