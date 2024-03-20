from __future__ import annotations
from pydantic import BaseModel

# TODO


class OrderItemBase(BaseModel):
    orderid: int
    menuitemid: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    name: str
    quantity: int

    class Config:
        orm_mode = True
