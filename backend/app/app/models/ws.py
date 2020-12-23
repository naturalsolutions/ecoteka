import logging
import time
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from starlette.websockets import WebSocket
from fastapi.encoders import jsonable_encoder


log = logging.getLogger(__name__) 

class WSManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket] = {}

    async def connect(self, uuid: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[uuid] = websocket

    def disconnect(self, uuid: str):
        del self.active_connections[uuid]

    async def broadcast_message(self, organization_id: int, data: Any):
        """
        Broadcast message to all connected users.
        """
        data_json = jsonable_encoder(data)

        for ws in self.active_connections.values():
            await ws.send_json({
                "type": "MESSAGE", 
                "data": {
                    "organization_id": organization_id, 
                    "data": data_json
                }
            })
