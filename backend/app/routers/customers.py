from typing import Annotated, List, Union
from fastapi import APIRouter, Depends, Query
from fastapi.params import Security
from sqlalchemy.orm import Session

from app.sql_app.schemas.user import UserWithRole
from app.sql_app.schemas.user import User

from ..integration_tests.helper import Roles

from ..auth.security import get_current_user

from ..sql_app.schemas.restaurant import (
    Order, OrderCreate, OrderWithRestaurant, RequestAssistance,
    RequestAssistanceCreate, UserPoints
)
from ..sql_app.database import get_db
from ..sql_app.crud import customer

router = APIRouter(
    prefix="/customer",
    tags=["customer"],
    responses={404: {"description": "Not found"}}
)

"""
Order operations
"""
roles = Roles()


async def get_current_customer(
    current_user:
        Annotated[User, Security(get_current_user, scopes=[
            roles.CHEF, roles.WAITER, roles.CUSTOMER, roles.MANAGER
        ])]
):
    return current_user


def verify_customer_with_user(
    db: Session, user: User, order: OrderCreate
):
    if not user:
        return


def verify_customer_with_order(
    db: Session, user: User, order_id: int
):
    if not user:
        return
    customer.verify_customer_with_order(db, user, order_id)


@router.post("/order", response_model=Order)
async def create_order(
    order: OrderCreate,
    user: Annotated[User, Security(get_current_customer)],
    db: Session = Depends(get_db)
):
    verify_customer_with_user(db, user, order)
    return customer.create_order(db, user, order)


@router.get("/order/{order_id}", response_model=Order)
async def get_order(
    order_id: int,
    user: Annotated[User, Security(get_current_customer)],
    db: Session = Depends(get_db)
):
    verify_customer_with_order(db, user, order_id)
    return customer.get_order(db, order_id)


@router.get("/orders", response_model=List[OrderWithRestaurant])
async def get_customer_orders(
    user: Annotated[UserWithRole, Security(get_current_customer)],
    status: Annotated[Union[str, None], Query()] = None,
    db: Session = Depends(get_db)
):
    # status should either be pending or completed
    # pending returns all ready and pending orders
    # completed returns all served orders
    if not status:
        return customer.get_all_customer_orders(db, user)
    return customer.get_customer_orders_by_status(db, user, status)


@router.get("/order/{order_id}/cost")
async def get_order_bill(
    order_id: int,
    user: Annotated[UserWithRole, Security(get_current_customer)],
    db: Session = Depends(get_db)
):
    return customer.get_order_bill(db, order_id)
"""
Request assistance functionality
"""


@router.post("/request-assistance", response_model=RequestAssistance)
async def request_assistance(
    request: RequestAssistanceCreate,
    db: Session = Depends(get_db)
):
    return customer.request_assistance(db, request)


"""
User loyalty program
"""


@router.get("/points/{restaurant_id}", response_model=UserPoints)
async def get_user_points(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_customer)],
    db: Session = Depends(get_db)
):
    return customer.get_user_points(db, user, restaurant_id)


@router.post("/points/{restaurant_id}", response_model=UserPoints)
async def apply_user_points(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_customer)],
    db: Session = Depends(get_db)
):
    return customer.apply_user_points(db, user, restaurant_id)
