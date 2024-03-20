from __future__ import annotations
from sqlalchemy import Column, String

from .loyalty_schema import UserLoyaltyProgram
from ..database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    imagepath = Column(String, nullable=False)
    hashedpassword = Column(String, nullable=False)
    orders = relationship("Order", back_populates="customer")
    programs = relationship(
        "LoyaltyProgram",
        secondary=UserLoyaltyProgram,
        back_populates="users",
        cascade="all, delete"
    )
