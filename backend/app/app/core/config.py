import secrets
from typing import (
    Any,
    Dict,
    List,
    Optional,
    Union
)
from pathlib import Path
from pydantic import (
    AnyHttpUrl,
    BaseSettings,
    EmailStr,
    PostgresDsn,
    validator
)
from datetime import timedelta


class Settings(BaseSettings):
    ROOT_PATH: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    authjwt_secret_key: str = SECRET_KEY
    authjwt_access_token_expires: timedelta = timedelta(minutes=30)
    authjwt_refresh_token_expires: timedelta = timedelta(days=8)

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    EXTERNAL_PATH: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200",\
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(
        cls,
        v: Union[str, List[str]]
    ) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str
    DB_SCHEMA: str = "postgresql"
    DB_SERVER: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: str = "5432"
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(
        cls,
        v: Optional[str],
        values: Dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme=values.get("DB_SCHEMA"),
            user=values.get("DB_USER"),
            password=values.get("DB_PASSWORD"),
            host=values.get("DB_SERVER"),
            port=values.get("DB_PORT"),
            path=f"/{values.get('DB_NAME') or ''}",
        )

    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "test@example.com"  # type: ignore
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    FIRST_SUPERUSER_FULLNAME: str
    SUPERUSERS_CONTACT_LIST: Optional[EmailStr] = None
    USERS_OPEN_REGISTRATION: bool = True
    ORGANIZATION: str = "Ecoteka"

    UPLOADED_FILES_FOLDER: Path = Path("/app/app/uploaded_files")
    TILES_FOLDER: Path = Path("/app/tiles")
    TILES_SERVER: str = 'https://dev.ecoteka.org/tiles'
    GEO_FILES_ALLOWED: str = 'geojson,zip,csv,xls,xlsx'
    CELERY_BROKER_URL: str
    CELERY_BACKEND: str

    class Config:
        case_sensitive = True


settings = Settings()
