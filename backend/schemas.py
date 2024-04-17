# backend/schemas.py

from pydantic import BaseModel
from typing import Optional
class LocationBase(BaseModel):
    description: str

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    order_number: str
    location_id: int
    done: Optional[bool]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int

    class Config:
        orm_mode = True
