from sqlalchemy import Column, String
from ..database import Base


class OrderStatus(Base):
    __tablename__ = "orderstatus"
    statusname = Column(String, primary_key=True, nullable=False)
