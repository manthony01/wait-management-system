from sqlalchemy import (
    Column, ForeignKey, Integer, String
)
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from ..database import Base


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    tableid = Column(Integer, ForeignKey("restauranttable.tableid"))
    comment = Column(String)
    restaurantid = Column(Integer, ForeignKey("restaurant.id"))
    ordered_at = Column(DateTime, nullable=False, default=datetime.now())
    # set nullable=true to allow for development without auth
    ordered_by = Column(String, ForeignKey("users.email"), nullable=True)
    customer = relationship("User", back_populates="orders")
    orderitems = relationship(
        "OrderItem",
        uselist=True,
        cascade="all, delete"
    )
    restaurant = relationship(
        "Restaurant", back_populates="orders",
        uselist=False
    )
