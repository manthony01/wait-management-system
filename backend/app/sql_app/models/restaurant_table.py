from ..database import Base
from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship


class RestaurantTable(Base):
    __tablename__ = "restauranttable"
    tableid = Column(Integer, primary_key=True, index=True, unique=True)
    restaurantid = Column(
        Integer, ForeignKey("restaurant.id"), primary_key=True
    )
    restaurant = relationship("Restaurant", back_populates="tables")
