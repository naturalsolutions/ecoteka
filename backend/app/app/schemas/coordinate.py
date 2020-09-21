from pydantic import BaseModel


class Coordinate(BaseModel):
    longitude: float
    latitude: float
