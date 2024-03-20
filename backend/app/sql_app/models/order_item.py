from sqlalchemy import Column, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship
from ..database import Base


class OrderItem(Base):
    __tablename__ = "orderitem"
    orderid = Column(Integer, ForeignKey("orders.id"), primary_key=True)
    menuitemid = Column(Integer, ForeignKey("menuitem.id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    orderstatus = Column(String,
                         nullable=False)
    # order = relationship("Order")
