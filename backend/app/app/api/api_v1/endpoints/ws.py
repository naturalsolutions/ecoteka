import logging
from typing import Optional, Any
from starlette.websockets import WebSocket
from starlette.endpoints import WebSocketEndpoint
from app.models.ws import WSChannel
from fastapi import APIRouter

log = logging.getLogger(__name__) 

router = APIRouter()


@router.websocket_route("/ws", name="ws")
class WSChannelLive(WebSocketEndpoint):
    """Live connection to the global :class:`~.WSChannel` instance, via WebSocket.
    """

    encoding: str = "text"
    session_name: str = ""
    count: int = 0

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel: Optional[WSChannel] = None
        self.user_id: Optional[str] = None

    @classmethod
    def get_next_user_id(cls):
        """
        Returns monotonically increasing numbered usernames in the form
            'user_[number]'
        """
        user_id: str = f"user_{cls.count}"
        cls.count += 1
        return user_id

    async def on_connect(self, websocket):
        """
        Handle a new connection.
        New users are assigned a user ID and notified of the channel's connected
        users. The other connected users are notified of the new user's arrival,
        and finally the new user is added to the global :class:`~.WSChannel` instance.
        """
        log.info("Connecting new user...")
        channel: Optional[WSChannel] = self.scope.get("ws_channel")
        if channel is None:
            raise RuntimeError(f"Global `WSChannel` instance unavailable!")
        self.channel = channel
        self.user_id = self.get_next_user_id()
        await websocket.accept()
        await websocket.send_json(
            {"type": "CHANNEL_JOIN", "data": {"user_id": self.user_id}}
        )
        await self.channel.broadcast_user_joined(self.user_id)
        self.channel.add_user(self.user_id, websocket)

    async def on_disconnect(self, _websocket: WebSocket, _close_code: int):
        """Disconnect the user, removing them from the :class:`~.WSChannel`, and
        notifying the other users of their departure.
        """
        if self.user_id is None:
            raise RuntimeError(
                "WSChannelLive.on_disconnect() called without a valid user_id"
            )
        
        self.channel.remove_user(self.user_id)
        await self.channel.broadcast_user_left(self.user_id)

    async def on_receive(self, _websocket: WebSocket, msg: Any):
        """Handle incoming message: `msg` is forwarded straight to `broadcast_message`.
        """
        if self.user_id is None:
            raise RuntimeError("WSChannelLive.on_receive() called without a valid user_id")
        if not isinstance(msg, str):
            raise ValueError(f"WSChannelLive.on_receive() passed unhandleable data: {msg}")
        
        await self.channel.broadcast_message(self.user_id, msg)