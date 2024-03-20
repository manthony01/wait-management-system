from __future__ import annotations
from sqlalchemy import Integer, Column, ForeignKey, Table, String
from sqlalchemy.orm import relationship
from ..database import Base


UserLoyaltyProgram = Table(
    'UserLoyaltyProgram',
    Base.metadata,
    Column("userid", String, ForeignKey("users.email"), primary_key=True),
    Column("restaurantid", Integer, ForeignKey("loyaltyprogram.restaurantid"),
           primary_key=True),
    Column("points", Integer, nullable=False, default=0)
)


class LoyaltyProgram(Base):
    __tablename__ = "loyaltyprogram"
    restaurantid = Column(
        Integer, ForeignKey("restaurant.id"), primary_key=True
    )
    minimum = Column(Integer, nullable=False)
    discount = Column(Integer, nullable=False)
    multiplier = Column(Integer, nullable=False)
    users = relationship(
        "User",
        secondary=UserLoyaltyProgram, back_populates="programs",
        cascade="all, delete"
    )
