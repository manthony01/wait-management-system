from .staff import StaffInRestaurant
# from .staff import StaffInRestaurant
from ..database import Base
from sqlalchemy import Integer, Column, String
from sqlalchemy.orm import relationship


class Restaurant(Base):
    __tablename__ = "restaurant"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    imagepath = Column(String, nullable=False)
    comment = Column(String)
    tables = relationship(
        "RestaurantTable",
        back_populates="restaurant",
        cascade="all, delete"
    )
    staff = relationship(
        "Staff",
        secondary=StaffInRestaurant,
        back_populates="restaurants",
        uselist=True,
        cascade="all, delete"
    )
    orders = relationship(
        "Order",
        back_populates="restaurant",
        cascade="all, delete"
    )
    menuitems = relationship(
        "MenuItem",
        back_populates="restaurant",
        cascade="all, delete"
    )
    categories = relationship(
        "Category",
        back_populates="restaurant",
        cascade="all, delete"
    )
