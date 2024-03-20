from ..database import Base
from sqlalchemy import Integer, Column, ForeignKey, String, DateTime
from datetime import datetime
# from sqlalchemy.orm import relationship


class RequestAssistance(Base):
    __tablename__ = "requestassistance"
    requestid = Column(Integer, primary_key=True, index=True, unique=True)
    tableid = Column(Integer, ForeignKey("restauranttable.tableid"))
    restaurantid = Column(Integer, ForeignKey("restaurant.id"))
    requested_at = Column(DateTime, nullable=False, default=datetime.now())
    statusname = Column(String, nullable=False, default="requesting")
