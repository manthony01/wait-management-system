from typing import List, Optional
from pydantic import BaseModel


class TagBase(BaseModel):
    tagname: str
    colour: str


class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True


class TagWithMenuItems(Tag):
    menuitems: Optional[List[Tag]]
