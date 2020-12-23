import logging
import time
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from starlette.websockets import WebSocket
from fastapi.encoders import jsonable_encoder


log = logging.getLogger(__name__) 

class WSManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    def __len__(self) -> int:
        """
        Get the number of active connections in the channel.
        """
        return len(self.active_connections)

    @property
    def empty(self) -> bool:
        """
        Check if the channel is empty.
        """
        return len(self.active_connections) == 0


    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_message(self, organization_id: int, data: Any):
        """
        Broadcast message to all connected users.
        """
        data_json = jsonable_encoder(data)

        for websocket in self.active_connections:
            await websocket.send_json({
                "type": "MESSAGE", 
                "data": {
                    "organization_id": organization_id, 
                    "data": data_json
                }
            })
