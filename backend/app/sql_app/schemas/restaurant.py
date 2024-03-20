from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from .user import User
from .tag import Tag


class RestaurantBase(BaseModel):
    name: str
    comment: str
    imagepath: str


class RestaurantWithId(RestaurantBase):
    id: int


class RestaurantCreate(RestaurantBase):
    pass


class Restaurant(RestaurantBase):
    id: int
    tables: list[RestaurantTable]
    menuitems: list[MenuItem]
    staff: list[Staff]
    categories: list[Category]
    orders: list[Order]

    class Config:
        orm_mode = True


class RestaurantWithRole(Restaurant):
    role: str


class RestaurantPatch(BaseModel):
    name: Optional[str]
    comment: Optional[str]
    imagepath: Optional[str]


class RestaurantTableBase(BaseModel):
    tableid: int
    restaurantid: int


class RestaurantTableCreate(RestaurantTableBase):
    pass


class RestaurantTable(RestaurantTableBase):

    class Config:
        orm_mode = True


class MenuItemBase(BaseModel):
    title: str
    description: str
    cost: float
    imagepath: str
    ingredients: str
    orderindex: str
    categoryid: int
    restaurantid: int


class MenuItemCreate(MenuItemBase):
    tags: Optional[List[int]] = []
    pass


class MenuItem(MenuItemBase):
    id: int

    class Config:
        orm_mode = True


class MenuItemWithTag(MenuItem):
    tags: List[Tag]
    pass


class MenuItemRead(MenuItem):
    tags: List[Tag]
    category: Optional[Category] = None
    restaurant: Optional[Restaurant] = None


class MenuItemPatch(BaseModel):
    title: Optional[str]
    description: Optional[str]
    ingredients: Optional[str]
    imagepath: Optional[str]
    cost: Optional[float]
    orderindex: Optional[str]
    categoryid: Optional[int]
    tags: Optional[List[int]]


class MenuRead(BaseModel):
    pass


class RoleBase(BaseModel):
    role_name: str


class RoleCreate(RoleBase):
    pass


class Role(RoleBase):
    id: int
    staff: list[Staff]

    class Config:
        orm_mode = True


class StaffBase(BaseModel):
    email: int
    password: int


class StaffCreate(StaffBase):
    pass


class Staff(BaseModel):
    email: str
    rolename: str

    class Config:
        orm_mode = True


class StaffWithName(Staff):
    firstname: str
    lastname: str


class StaffRead(Staff):
    restaurants: Optional[list[Restaurant]] = []
    pass


class StaffAdd(BaseModel):
    email: str
    role: str


class CategoryBase(BaseModel):
    name: str
    restaurantid: int
    orderindex: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class MenuWithTags(Category):
    items: List[MenuItemWithTag]


class CategoryPatch(BaseModel):
    name: Optional[str]
    orderindex: Optional[str]


class CategoryWithRestaurant(Category):
    restaurant: Optional[Restaurant] = None


class OrderItemBase(BaseModel):
    menuitemid: int
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(BaseModel):
    orderid: int
    orderstatus: str
    menuitemid: int
    quantity: int

    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    tableid: int
    comment: Optional[str]
    restaurantid: int


class OrderCreate(OrderBase):
    orderitems: list[OrderItemCreate]


class Order(OrderBase):
    id: int
    tableid: int
    comment: Optional[str]
    restaurantid: int
    ordered_at: datetime = datetime.now()
    orderitems: list[OrderItem]

    class Config:
        orm_mode = True


class OrderWithRestaurant(Order):
    restaurant: RestaurantWithId


class OrderPatch(BaseModel):
    orderstatus: Optional[str]


class RequestAssistanceBase(BaseModel):
    tableid: int
    restaurantid: int


class RequestAssistanceCreate(RequestAssistanceBase):
    pass


class RequestAssistance(RequestAssistanceBase):
    requestid: int
    statusname: str = "requesting"
    requested_at: datetime = datetime.now()

    class Config:
        orm_mode = True


class RequestAssistancePatch(BaseModel):
    statusname: str


class LoyaltyProgramBase(BaseModel):
    minimum: int
    discount: int
    multiplier: int
    restaurantid: int


class LoyaltyProgramCreate(LoyaltyProgramBase):
    pass


class LoyaltyProgramPatch(LoyaltyProgramBase):
    minimum: Optional[int]
    discount: Optional[int]
    multiplier: Optional[int]
    restaurantid: Optional[int]


class LoyaltyProgram(LoyaltyProgramBase):
    # users: List[User]

    class Config:
        orm_mode = True


class UserPoints(BaseModel):
    points: int
    restaurantid: int
    email: str
    discount: int


class UserWithProgram(BaseModel):
    restaurantid: int
    points: int
    user: User


MenuItem.update_forward_refs(Category=Category)
Restaurant.update_forward_refs(RestaurantTable=RestaurantTable)
Restaurant.update_forward_refs(MenuItem=MenuItem)
Restaurant.update_forward_refs(Staff=Staff)
Restaurant.update_forward_refs(Category=Category)
RestaurantWithRole.update_forward_refs(RestaurantTable=RestaurantTable)
RestaurantWithRole.update_forward_refs(MenuItem=MenuItem)
RestaurantWithRole.update_forward_refs(Staff=Staff)
RestaurantWithRole.update_forward_refs(Category=Category)
Role.update_forward_refs(Staff=Staff)
MenuItemRead.update_forward_refs(Category=Category)
