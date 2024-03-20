from __future__ import annotations
from sqlalchemy.orm import relationship
from sqlalchemy import (
    ForeignKeyConstraint, Integer, Column, String, ForeignKey, Table
)
from ..database import Base

StaffInRestaurant = Table(
    'StaffInRestaurant',
    Base.metadata,
    Column('email', String, primary_key=True),
    Column('rolename', String, primary_key=True),
    Column('restaurantid', Integer, ForeignKey('restaurant.id'),
           primary_key=True),
    ForeignKeyConstraint(["email", "rolename"],
                         ["staff.email", "staff.rolename"]))


class Staff(Base):
    __tablename__ = "staff"
    email = Column(String, primary_key=True)
    rolename = Column(
        String,
        primary_key=True
    )
    restaurants = relationship(
        "Restaurant",
        secondary=StaffInRestaurant, back_populates="staff",
        cascade="all, delete"
    )
