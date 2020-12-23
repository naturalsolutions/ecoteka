import logging
from typing import Optional, Any
from starlette.websockets import WebSocket, WebSocketDisconnect
from starlette.endpoints import WebSocketEndpoint
from app.models.ws import WSManager
from fastapi import APIRouter, Request

log = logging.getLogger(__name__) 

router = APIRouter()


@router.websocket("/ws/{organization_id}/{uuid}", name="ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    organization_id: int,
    uuid: str
):
    manager: Optional[WSManager] = websocket.scope.get('ws_manager')

    if manager is None:
        return

    await manager.connect(uuid, websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast_message(organization_id=organization_id, data=data)
    except WebSocketDisconnect:
        manager.disconnect(uuid)    