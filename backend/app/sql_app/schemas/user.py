from __future__ import annotations
from typing import Union
# from typing import Union
from pydantic import BaseModel


class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: str
    imagepath: str


class UserCreate(UserBase):
    password: str
    pass


class UserLogin(UserBase):
    id: int
    password: str


class User(UserBase):

    class Config:
        orm_mode = True


class UserWithRole(User):
    role: str


class StaffWithName(User):
    role: str


class UserResponse(User):
    pass


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenWithUser(Token):
    user: User


class TokenData(BaseModel):
    email: Union[str, None] = None
    scope: str
