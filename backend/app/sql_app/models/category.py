from __future__ import annotations
from sqlalchemy import Integer, Column, String, ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship


class Category(Base):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    orderindex = Column(String, nullable=False)
    restaurantid = Column(Integer, ForeignKey("restaurant.id"), nullable=False)
    restaurant = relationship(
        "Restaurant",
        back_populates="categories",
        uselist=False
    )
    menuitems = relationship(
        "MenuItem",
        back_populates="category"
    )
