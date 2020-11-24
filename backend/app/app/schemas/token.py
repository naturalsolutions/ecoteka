from typing import Optional

from pydantic import BaseModel


class RefreshToken(BaseModel):
    refresh_token: str
    token_type: str


class RefreshTokenIn(BaseModel):
    refresh_token: str


class AccessToken(BaseModel):
    access_token: str
    token_type: str


class AccessAndRefreshToken(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None
