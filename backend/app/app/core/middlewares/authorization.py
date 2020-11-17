from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from starlette.types import ASGIApp, Receive, Scope, Send
import casbin
import casbin_sqlalchemy_adapter
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from app.db.session import (
    engine
)
import logging

# TODO: add to settings
source_file = '/app/app/core/middlewares/authorization-model.conf'
adapter = casbin_sqlalchemy_adapter.Adapter(engine)
enforcer = casbin.Enforcer(source_file, adapter, True)

unless = [
    '/api/v1/docs',
    '/api/v1/openapi.json',
    '/api/v1/users',
    '/api/v1/auth/login'
]


class AuthorizationMiddleware():
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        request = Request(scope, receive)
        path = request.url.path

        # No check
        if path in unless:
            await self.app(scope, receive, send)
            return

        token = request.headers.get('Authorization', None)

        # No Auth in request
        if token is None:
            response = JSONResponse(
                status_code=HTTP_401_UNAUTHORIZED,
                content={"message": 'Unauthorized'},
                headers={"WWW-Authenticate": "Bearer"}
            )
            await response(scope, receive, send)
            return

        try:
            authorize = AuthJWT(req=request)
            authorize.jwt_required()
            # raw_token = authorize.get_jwt_subject(encoded_token=token)
            user_id = authorize.get_jwt_subject()
        except AuthJWTException as e:
            response = JSONResponse(
                status_code=e.status_code,
                content={"detail": e.message}
            )
            await response(scope, receive, send)
            return

        if self.check_permission(request=request, user=user_id):
            await self.app(scope, receive, send)
            return

        content = "Insufficient permissions."
        status_code = HTTP_403_FORBIDDEN

        response = JSONResponse(
            status_code=status_code,
            content={"message": content},
            headers={"WWW-Authenticate": "Bearer"},
        )

        await response(scope, receive, send)
        return

    def check_permission(self, request: Request, user):
        path = request.url.path
        method = request.method
        result = enforcer.enforce(user, path, method)
        return result
