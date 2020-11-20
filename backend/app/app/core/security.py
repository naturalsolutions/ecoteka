from fastapi import (
    Depends,
    HTTPException,
    status,
    Request
)
from fastapi.security import OAuth2PasswordBearer
from fastapi_jwt_auth import AuthJWT
from pydantic.typing import Optional
from sqlalchemy.orm import Session
from app.core import (
    settings
)
from app.api import get_db
from app.models import User
from app.crud import user, organization as crud_organization
import casbin
import casbin_sqlalchemy_adapter
from app.db.session import (
    engine
)
from sqlalchemy import text
from app.schemas import CurrentUSer


token_url = f"{settings.ROOT_PATH}/auth/login"

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=token_url
)


@AuthJWT.load_config
def get_config():
    return settings


def generate_refresh_token_response(
    user_id: int,
    is_superuser: bool,
    # Authorize: AuthJWT = Depends()
):
    Authorize = AuthJWT()
    user_claims = {
        'is_superuser': is_superuser
    }

    # refresh_token = Authorize.create_refresh_token(
    #     subject=str(user_id),
    #     user_claims=user_claims
    # )
    access_token = Authorize.create_access_token(
        subject=str(user_id),
        user_claims=user_claims
    )
    return {
        'access_token': access_token,
        "token_type": "Bearer"
    }
    # logging.info(f"refresh: {refresh_token}")
    # return {
    #     'refresh_token': refresh_token,
    #     "token_type": "Bearer"
    # }


def get_current_user(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: str = Depends(reusable_oauth2)
) -> User:
    Authorize.jwt_required(token=token)
    current_user_id = Authorize.get_jwt_subject()
    user_in_db = user.get(db, id=current_user_id)

    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user_in_db


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_verified(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user account is not verified"
        )
    return current_user


def get_current_user_if_is_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user


reusable_oauth2_optional = OAuth2PasswordBearer(
    tokenUrl=token_url,
    auto_error=False
)


def get_optional_current_active_user(
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
    token: Optional[str] = Depends(reusable_oauth2_optional)
) -> Optional[User]:
    if token is not None:
        Authorize.jwt_required(token=token)
        current_user_id = Authorize.get_jwt_subject()
        user_in_db = user.get(db, id=current_user_id)
        if user_in_db is not None:
            return user_in_db

    return None


source_file = '/app/app/core/authorization-model.conf'
adapter = casbin_sqlalchemy_adapter.Adapter(engine)
enforcer: casbin.Enforcer = casbin.Enforcer(source_file, adapter, True)

# enforcer.add_role_for_user_in_domain('1', 'admin', '1')
# enforcer.add_role_for_user_in_domain('2', 'reader', '1')


def authorization(action: str):
    def decorated(
        request: Request,
        organization_id,
        user=Depends(get_current_user)
    ):
        if not enforcer.enforce(str(user.id), str(organization_id), action):
            raise HTTPException(
                status_code=403,
                detail="The user doesn't have enough privileges"
            )

    return decorated


def set_policies(policies):
    for key in policies:
        action = key
        roles = policies[key]
        for role in roles:
            enforcer.add_policy([role, action])


def get_current_user_with_organizations(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    import pprint
    query = text(
        "SELECT v2 FROM casbin_rule WHERE ptype=:ptype AND v0=:user"
    )

    pprint.pprint(current_user.as_dict())

    result= CurrentUSer(
        **current_user.as_dict(),
        organizations= [
            crud_organization.get(db, id=row[0]).to_current_user_schema() for row in db.execute(query, {"ptype": "g", "user": str(current_user.id)})
        ]
    )

    return result

