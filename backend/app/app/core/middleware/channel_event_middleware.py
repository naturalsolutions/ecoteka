from app.models import ws
from starlette.types import ASGIApp, Receive, Scope, Send


class ChannelEventMiddleware: 
    """
    Middleware for providing a global :class:`~.Channel` instance to both HTTP
    and WebSocket scopes.
    
    Although it might seem odd to load the broadcast interface like this (as
    opposed to, e.g. providing a global) this both mimics the pattern
    established by starlette's existing DatabaseMiddlware, and describes a
    pattern for installing an arbitrary broadcast backend (Redis PUB-SUB,
    Postgres LISTEN/NOTIFY, etc) and providing it at the level of an individual
    request.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        self.manager = ws.WSManager()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] in ("lifespan", "http", "websocket"):
            scope["ws_manager"] = self.manager
        
        await self.app(scope, receive, send)