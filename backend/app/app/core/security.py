from datetime import timedelta
from fastapi import Depends, HTTPException, status, Request
from fastapi_jwt_auth import AuthJWT
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pydantic.typing import Optional
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import engine
from app.api import get_db
from app.core import settings
from app.schemas import CurrentUser
from app.models import Organization, User
from app.crud import user, organization as crud_organization
from app.core.dependencies import enforcer
from app.db.base import Base 

from oso import Oso
from sqlalchemy_oso import register_models, authorized_sessionmaker

from app.schemas import Tree


token_url = f"{settings.ROOT_PATH}/auth/login"
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=token_url)

# Init OSO
oso = Oso()

# Register Models or classes in OSO and load policies

register_models(oso, Base)
# oso.register_class(User)

oso.load_file(settings.POLICIES_FOLDER / "main.polar")


class Settings(BaseModel):
    authjwt_secret_key: str = settings.SECRET_KEY
    authjwt_access_token_expires: timedelta = settings.authjwt_access_token_expires
    authjwt_refresh_token_expires: timedelta = settings.authjwt_refresh_token_expires


@AuthJWT.load_config
def get_config():
    return Settings()


def generate_access_token_and_refresh_token_response(
    user_id: int,
    is_superuser: bool,
    # Authorize: AuthJWT = Depends()
):
    Authorize = AuthJWT()
    user_claims = {"is_superuser": is_superuser}

    refresh_token = Authorize.create_refresh_token(
        subject=str(user_id), user_claims=user_claims
    )
    access_token = Authorize.create_access_token(
        subject=str(user_id), user_claims=user_claims
    )
    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "refresh_token": refresh_token,
    }


def get_current_user_with_refresh_token(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: str = Depends(reusable_oauth2),
) -> User:
    Authorize.jwt_refresh_token_required()
    current_user_id = Authorize.get_jwt_subject()
    user_in_db = user.get(db, id=current_user_id)

    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user_in_db


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: str = Depends(reusable_oauth2),
) -> User:
    Authorize.jwt_required(token=token)
    current_user_id = Authorize.get_jwt_subject()
    user_in_db = user.get(db, id=current_user_id)

    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    request.state.user = user_in_db
    return user_in_db


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_verified(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user account is not verified",
        )
    return current_user


def get_current_user_if_is_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


reusable_oauth2_optional = OAuth2PasswordBearer(tokenUrl=token_url, auto_error=False)


def get_optional_current_active_user(
    request: Request,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: Optional[str] = Depends(reusable_oauth2_optional),
) -> Optional[User]:
    if token is not None:
        Authorize.jwt_required(token=token)
        current_user_id = Authorize.get_jwt_subject()
        user_in_db = user.get(db, id=current_user_id)
        if user_in_db is not None:
            request.state.user = user_in_db
            return user_in_db

    request.state.user = None
    return None


def authorization(action: str):
    def decorated(request: Request, organization_id, user=Depends(get_current_user)):
        if not enforcer.enforce(str(user.id), str(organization_id), action):
            raise HTTPException(
                status_code=403,
                detail="The user doesn't have enough privileges",
            )

    return decorated

def authorize(object: Organization, subject: Optional[User], action: str):
        if not subject:
            if object.mode == "public":
                pass
            if object.mode == "private":
                raise HTTPException(
                    status_code=403,
                    detail="Only authenticated members will be granted access to private organization. Please login first.",
                )
                
        if subject:
            if object.mode == "public":
                pass
            if object.mode == "private":
                if not enforcer.enforce(str(subject.id), str(object.id), action):
                    raise HTTPException(
                        status_code=403,
                        detail="The user doesn't have enough privileges",
                    )

def set_policies(policies):
    for key in policies:
        action = key
        roles = policies[key]
        for role in roles:
            enforcer.add_policy([role, action])


def get_current_user_with_organizations(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    query = text("SELECT v2 FROM casbin_rule WHERE ptype=:ptype AND v0=:user")
    params = {"ptype": "g", "user": str(current_user.id)}

    organizations = []

    for row in db.execute(query, params=params):
        organization_in_db = crud_organization.get(db, id=row[0])
        if organization_in_db is not None and isinstance(organization_in_db, Organization):
            current_roles = enforcer.get_roles_for_user_in_domain(str(current_user.id), str(organization_in_db.id))
            organization = organization_in_db.to_current_user_schema()
            if len(current_roles) > 0:
                organization.current_user_role = current_roles[0]
            organizations.append(organization)

    result = CurrentUser(
        **current_user.as_dict(),
        organizations=organizations,
    )

    return result

def get_oso_authorized_db(request: Request, current_user: User = Depends(get_optional_current_active_user)):
    get_oso = lambda: oso
    get_user = lambda: request.state.user
    get_action = lambda: request.scope["endpoint"].__name__
    print(request.scope["endpoint"].__name__)
    db = authorized_sessionmaker(get_oso, get_user, get_action, bind=engine)()
    try:
        yield db
    finally:
        db.close()

