import logging
import time
from typing import Dict, List, Optional
from pydantic import BaseModel
from starlette.websockets import WebSocket

log = logging.getLogger(__name__) 

class WSUser(BaseModel):
    """
    WebSocket User metadata
    """
    user_id: str
    connected_at: float

class WSChannel:
    def __init__(self):
        log.info("Creating new empty channel")
        self._users: Dict[str, WebSocket] = {}
        self._user_meta: Dict[str, WSUser] = {}

    def __len__(self) -> int:
        """
        Get the number of users in the channel.
        """
        return len(self._users)

    @property
    def empty(self) -> bool:
        """
        Check if the channel is empty.
        """
        return len(self._users) == 0

    @property
    def user_list(self) -> List[str]:
        """
        Return a list of IDs for connected users.
        """
        return list(self._users)

    def add_user(self, user_id: str, websocket: WebSocket):
        """
        Add a user websocket, keyed by corresponding user ID.
        Raises:
            ValueError: If the `user_id` already exists within the channel.
        """
        if user_id in self._users:
            raise ValueError(f"User {user_id} is already in the channel")
        log.info("Adding user %s to channel", user_id)
        self._users[user_id] = websocket
        self._user_meta[user_id] = WSUser(
            user_id=user_id, connected_at=time.time(), message_count=0
        )

    async def kick_user(self, user_id: str):
        """
        Forcibly disconnect a user from the channel.
        We do not need to call `remove_user`, as this will be invoked automatically
        when the websocket connection is closed by the `RoomLive.on_disconnect` method.
        Raises:
            ValueError: If the `user_id` is not held within the channel.
        """
        if user_id not in self._users:
            raise ValueError(f"User {user_id} is not in the channel")
        await self._users[user_id].send_json(
            {
                "type": "CHANNEL_KICK",
                "data": {"msg": "You have been kicked from the channel!"},
            }
        )
        log.info("Kicking user %s from channel", user_id)
        await self._users[user_id].close()

    def remove_user(self, user_id: str):
        """
        Remove a user from the channel.
        Raises:
            ValueError: If the `user_id` is not held within the channel.
        """
        if user_id not in self._users:
            raise ValueError(f"User {user_id} is not in the channel")
        log.info("Removing user %s from channel", user_id)
        del self._users[user_id]
        del self._user_meta[user_id]

    def get_user(self, user_id: str) -> Optional[WSUser]:
        """
        Get metadata on a user.
        """
        return self._user_meta.get(user_id)

    async def whisper(self, from_user: str, to_user: str, msg: str):
        """
        Send a private message from one user to another.
        Raises:
            ValueError: If either `from_user` or `to_user` are not present
                within the channel.
        """
        if from_user not in self._users:
            raise ValueError(f"Calling user {from_user} is not in the channel")
        log.info("User %s messaging user %s -> %s", from_user, to_user, msg)
        
        if to_user not in self._users:
            await self._users[from_user].send_json(
                {
                    "type": "ERROR",
                    "data": {"msg": f"User {to_user} is not in the channel!"},
                }
            )
            return
        await self._users[to_user].send_json(
            {
                "type": "WHISPER",
                "data": {"from_user": from_user, "to_user": to_user, "msg": msg},
            }
        )

    async def broadcast_message(self, user_id: str, msg: str):
        """
        Broadcast message to all connected users.
        """
        for websocket in self._users.values():
            await websocket.send_json(
                {"type": "MESSAGE", "data": {"user_id": user_id, "msg": msg}}
            )

    async def broadcast_user_joined(self, user_id: str):
        """
        Broadcast message to all connected users.
        """
        for websocket in self._users.values():
            await websocket.send_json({"type": "USER_JOIN", "data": user_id})

    async def broadcast_user_left(self, user_id: str):
        """
        Broadcast message to all connected users.
        """
        for websocket in self._users.values():
            await websocket.send_json({"type": "USER_LEAVE", "data": user_id})