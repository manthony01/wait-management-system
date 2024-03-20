from __future__ import annotations
from typing import Annotated, List, Union
from fastapi import APIRouter, Depends, Security, HTTPException
from sqlalchemy.orm import Session
from app.sql_app.schemas.restaurant import (
    Order, OrderItem, OrderPatch, RequestAssistance,
    RestaurantWithRole
)
from app.sql_app.database import get_db
from app.sql_app.crud import waiter
from app.auth.security import get_current_user
from app.integration_tests.helper import Roles
from app.routers.read import get_restaurant
from app.sql_app.models.staff import Staff
from app.sql_app.schemas.user import User
# from app.routers.read import get_restaurant


router = APIRouter(
    prefix="/staff",
    tags=["staff"],
    responses={404: {"description": "Not found"}}
)


def verify_staff_with_restaurant(
    db: Session, user: User, restaurant_id: int
):
    if not user:
        return False

    restaurant = get_restaurant(db, restaurant_id)
    staff_roles = [Roles.WAITER, Roles.MANAGER, Roles.CHEF]
    staff_found = None
    for role in staff_roles:
        staff = db.get(Staff, (user.email, role))
        if (staff in restaurant.staff):
            staff_found = staff
            break
    if not staff_found:
        raise HTTPException(
            status_code=404,
            detail=f"User does not work at restaurant: {restaurant_id}"
        )
    return True


def verify_staff_with_order(
    db: Session, user: User, order_id: int
):
    if not user:
        return False

    db_order = waiter.get_order(db, order_id)
    restaurant_id = db_order.restaurantid

    return verify_staff_with_restaurant(db, user, restaurant_id)


def verify_staff_with_request(
    db: Session, user: User, request_id: int
):
    if not user:
        return False

    db_request = waiter.get_assistance_request(db, request_id)
    restaurant_id = db_request.restaurantid
    return verify_staff_with_restaurant(db, user, restaurant_id)


async def get_current_staff(
    current_user:
        Annotated[User, Security(get_current_user, scopes=[
            Roles.WAITER, Roles.MANAGER, Roles.CHEF
        ])]
):
    return current_user


@router.get(
    "/restaurants",
    response_model=List[RestaurantWithRole]
)
async def get_all_staff_restaurants(
    user: Annotated[User, Security(get_current_staff)],
    db: Session = Depends(get_db)
):
    return waiter.get_all_restaurants(db, user)


@router.patch("/order/{order_id}/orderItem/{menu_id}",
              response_model=OrderItem)
async def update_order_status(
    order: OrderPatch,
    order_id: int,
    menu_id: int,
    user: Annotated[User, Security(get_current_staff)],
    db: Session = Depends(get_db)
):
    verify_staff_with_order(db, user, order_id)
    return waiter.update_order(db, order_id, menu_id, order)


@router.get(
    "/order/{order_id}",
    response_model=Order
)
async def get_order(
    order_id: int,
    user: Annotated[User, Security(get_current_staff)],
    db: Session = Depends(get_db)
):
    verify_staff_with_order(db, user, order_id)
    return waiter.get_order(db, order_id)


@router.get(
    "/restaurant/{restaurant_id}/orders",
    response_model=List[Order]
)
async def get_orders_by_status(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_staff)],
    status: Union[str, None] = None,
    db: Session = Depends(get_db)
):
    verify_staff_with_restaurant(db, user, restaurant_id)
    if status:
        return waiter.get_orders_by_status(db, restaurant_id, status)
    return waiter.get_all_orders(db, restaurant_id)


@router.get(
    "/order/{order_id}/orderItem/{menu_item_id}",
    response_model=OrderItem
)
async def get_order_item(
    order_id: int,
    menu_item_id: int,
    user: Annotated[User, Security(get_current_staff)],
    db: Session = Depends(get_db)
):
    verify_staff_with_order(db, user, order_id)
    return waiter.get_order_item(db, order_id, menu_item_id)


@router.get(
    "/restaurant/{restaurant_id}/orderItems",
    response_model=List[OrderItem]
)
async def get_order_by_status(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_staff)],
    status: Union[str, None] = None,
    db: Session = Depends(get_db)
):
    verify_staff_with_restaurant(db, user, restaurant_id)
    if status:
        return waiter.get_order_by_status(db, status, restaurant_id)
    return waiter.get_restaurant_orders(db, restaurant_id)


@router.get(
    "/restaurant/{restaurant_id}/requests",
    response_model=List[RequestAssistance]
)
async def get_all_assistance_requests_by_status(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_staff)],
    status: Union[str, None] = None,
    db: Session = Depends(get_db)
):
    verify_staff_with_restaurant(db, user, restaurant_id)
    if status:
        return waiter.get_assistance_requests_by_status(
            db, restaurant_id, status)
    return waiter.get_assistance_requests_by_status(
        db, restaurant_id, "requesting"
    )


@router.patch(
    "/request/{request_id}",
    response_model=RequestAssistance
)
async def update_request_assistance_status(
    request_id: int,
    user: Annotated[User, Security(get_current_staff)],
    db: Session = Depends(get_db)
):
    verify_staff_with_request(db, user, request_id)
    return waiter.update_request_assistance_status(
        db, request_id
    )
