from __future__ import annotations
from sqlalchemy.orm import relationship
from sqlalchemy import Integer, Column, String, Double, ForeignKey
from ..database import Base


class MenuItem(Base):
    __tablename__ = "menuitem"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    cost = Column(Double, nullable=False)
    imagepath = Column(String, nullable=True)
    ingredients = Column(String, nullable=False)
    orderindex = Column(String, nullable=False)
    categoryid = Column(Integer, ForeignKey("category.id"))
    restaurantid = Column(Integer, ForeignKey("restaurant.id"), nullable=False)
    category = relationship("Category", back_populates="menuitems")
    restaurant = relationship("Restaurant", back_populates="menuitems")
    tags = relationship(
        "Tag", secondary="MenuItemTag",
        back_populates="menuitems"
        # cascade="all, delete"
    )
