from sqlalchemy.engine import create_engine
from sqlalchemy.orm.session import sessionmaker
from app.core.config import settings



# SQLALCHEMY_DATABASE_URI is builded from Settings
# so we have the same env variables in prod/dev
# if you need to build another connection string
# uncomment the following lines
# and build your connection string
# with your own variables if you need it
#
# from pydantic import PostgresDsn
# SQLALCHEMY_DATABASE_URI = PostgresDsn.build(
#     scheme=settings.DB_SCHEMA,
#     user=settings.DB_USER,
#     password=settings.DB_PASSWORD,
#     host=settings.DB_SERVER,
#     port=settings.DB_PORT,
#     path=f"/{settings.DB_NAME}_test"
# )
SQLALCHEMY_DATABASE_URI = settings.SQLALCHEMY_DATABASE_URI
db_test_uri = f"{SQLALCHEMY_DATABASE_URI}_test"
setattr(settings, "SQLALCHEMY_DATABASE_URI", db_test_uri)

engine = create_engine(db_test_uri, pool_pre_ping=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
