from sqlalchemy import Column, Integer, String, ForeignKey, Table

from ..database import Base
from sqlalchemy.orm import relationship

MenuItemTag = Table(
    'MenuItemTag',
    Base.metadata,
    Column('tagid', Integer, ForeignKey("tag.id"), primary_key=True),
    Column('menuitemid', Integer, ForeignKey("menuitem.id"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tag"
    id = Column(Integer, primary_key=True)
    tagname = Column(String, nullable=False)
    colour = Column(String)
    menuitems = relationship(
        "MenuItem", secondary="MenuItemTag",
        back_populates="tags",
        cascade="all, delete"
    )
