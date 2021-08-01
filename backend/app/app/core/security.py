from app.api import get_db
from app.api.deps import get_enforcer
from app.core import settings
from app.schemas import CurrentUser
from datetime import timedelta
from fastapi import Depends, HTTPException, status, Request
from fastapi_jwt_auth import AuthJWT
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pydantic.typing import Optional
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import Organization, User, organization
from app.crud import user, organization as crud_organization


token_url = f"{settings.ROOT_PATH}/auth/login"
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=token_url)


@AuthJWT.load_config
def get_config():
    return settings


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

    return user_in_db


def get_current_user_if_is_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


reusable_oauth2_optional = OAuth2PasswordBearer(
    tokenUrl=token_url, auto_error=False
)


def get_optional_current_active_user(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: Optional[str] = Depends(reusable_oauth2_optional),
) -> Optional[User]:
    if token is not None:
        Authorize.jwt_required(token=token)
        current_user_id = Authorize.get_jwt_subject()
        user_in_db = user.get(db, id=current_user_id)
        if user_in_db is not None:
            return user_in_db

    return None


def authorization(action: str):
    def decorated(
        request: Request,
        organization_id: int,
        user=Depends(get_current_user),
        enforcer=Depends(get_enforcer),
    ):
        if user.is_superuser:
            return

        user_roles = enforcer.get_roles_for_user_in_domain(
            str(user.id), str(organization_id)
        )

        for role in user_roles:
            if not enforcer.has_named_policy("p", role, action):
                raise HTTPException(
                    status_code=403,
                    detail="The user doesn't have enough privileges",
                )

        if not enforcer.enforce(str(user.id), str(organization_id), action):
            raise HTTPException(
                status_code=403,
                detail="The user doesn't have enough privileges",
            )

    return decorated


def permissive_authorization(action: str):
    def decorated(
        request: Request,
        organization_id,
        user=Depends(get_optional_current_active_user),
        db: Session = Depends(get_db),
        enforcer=Depends(get_enforcer),
    ):

        organization = crud_organization.get_by_id_or_slug(
            db, id=organization_id
        )

        if not organization:
            raise HTTPException(
                status_code=404,
                detail="Organization not found!",
            )
        if not user:
            if organization.mode == "open":
                pass
            if organization.mode == "private":
                raise HTTPException(
                    status_code=403,
                    detail="Only authenticated members will be granted access to private organization. Please login first.",
                )
        if user:
            if organization.mode == "open":
                pass
            if organization.mode == "private":
                if user.is_superuser:
                    pass
                if not enforcer.enforce(
                    str(user.id), str(organization.id), action
                ):
                    raise HTTPException(
                        status_code=403,
                        detail="The user doesn't have enough privileges",
                    )

    return decorated


def authorize(
    object: Organization, subject: Optional[User], action: str, enforcer
):
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
            if subject.is_superuser:
                pass
            if not enforcer.enforce(str(subject.id), str(object.id), action):
                raise HTTPException(
                    status_code=403,
                    detail="The user doesn't have enough privileges",
                )


def set_policies(policies, enforcer):
    for key in policies:
        action = key
        roles = policies[key]
        for role in roles:
            enforcer.add_policy([role, action])


def get_current_user_with_organizations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    enforcer=Depends(get_enforcer),
):
    query = text("SELECT v2 FROM casbin_rule WHERE ptype=:ptype AND v0=:user")
    params = {"ptype": "g", "user": str(current_user.id)}

    organizations = []

    for row in db.execute(query, params=params):
        organization_in_db = crud_organization.get(db, id=row[0])
        if organization_in_db is not None and isinstance(
            organization_in_db, Organization
        ):
            current_roles = enforcer.get_roles_for_user_in_domain(
                str(current_user.id), str(organization_in_db.id)
            )
            organization = organization_in_db.to_current_user_schema()
            if len(current_roles) > 0:
                organization.current_user_role = current_roles[0]
            organizations.append(organization)

    result = CurrentUser(
        **current_user.as_dict(),
        organizations=organizations,
    )

    return result
