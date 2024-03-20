# from fastapi import HTTPException
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.sql_app.models.order import Order
from app.sql_app.models.order_item import OrderItem
from app.sql_app.models.request_assistance import RequestAssistance
from app.sql_app.models.restaurant import Restaurant
from app.sql_app.models.staff import Staff, StaffInRestaurant
from app.sql_app.schemas.user import User
from ..schemas.restaurant import OrderPatch
from app.routers.read import get_menu_item
from app.routers.read import get_restaurant


def get_all_restaurants(db: Session, user: User):
    working_restaurants = db.query(Restaurant).join(
        StaffInRestaurant
    ).join(
        Staff
    ).filter(
        Staff.email == user.email
    ).all()
    result = []
    for restaurant in working_restaurants:
        for staff in restaurant.staff:
            if staff.email == user.email:
                restaurant.role = staff.rolename
                result.append(restaurant)
                break
    return result


# check order status
def check_order_status(status):
    status = status.lower()
    if status == "served" or status == "ready" or status == "pending":
        pass
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Order status name is not valid: {status}"
        )


def update_order(db: Session, order_id: int, menu_id: int, order: OrderPatch):
    # check order item exists
    db_order_item = get_order_item(db, order_id, menu_id)

    # check if order status is valid
    check_order_status(order.orderstatus)
    order_item_data = order.dict(exclude_unset=True)

    for key, value in order_item_data.items():
        if not hasattr(db_order_item, key):
            raise HTTPException(
                status_code=400,
                detail=f"unexpected attribute: {key}"
            )
        setattr(db_order_item, key, value)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item


def get_order(db: Session, order_id: int):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Order not found with id {order_id}"
        )
    return order


def get_order_item(db: Session, order_id: int, menu_item_id: int):
    get_order(db, order_id)
    get_menu_item(db, menu_item_id)
    order_item = db.get(OrderItem, (order_id, menu_item_id))
    if not order_item:
        raise HTTPException(
            status_code=404,
            detail=f"OrderItem not found with id {menu_item_id}"
        )
    return order_item


def get_order_by_status(db: Session, order_status: str, restaurant_id: int):
    get_restaurant(db, restaurant_id)
    orders = db.query(OrderItem).with_entities(
        OrderItem.orderid,
        OrderItem.menuitemid,
        OrderItem.quantity,
        OrderItem.orderstatus
    ).join(Order).filter(Order.restaurantid == restaurant_id,
                         OrderItem.orderstatus == order_status.lower()
                         ).order_by(Order.id.desc()).all()
    return orders


def get_restaurant_orders(db: Session, restaurant_id: int):
    get_restaurant(db, restaurant_id)
    orders = db.query(OrderItem).with_entities(
        OrderItem.orderid,
        OrderItem.menuitemid,
        OrderItem.quantity,
        OrderItem.orderstatus
    ).join(Order).filter(Order.restaurantid == restaurant_id).order_by(
        Order.id.asc()).all()
    return orders


def get_assistance_requests_by_status(db: Session, restaurant_id: int,
                                      status: str):
    get_restaurant(db, restaurant_id)
    active_requests = db.query(RequestAssistance).filter(
        RequestAssistance.statusname == status,
        RequestAssistance.restaurantid == restaurant_id).all()
    return active_requests


def get_assistance_request(db: Session, request_id: int):
    request = db.get(RequestAssistance, request_id)
    if not request:
        raise HTTPException(
            status_code=404,
            detail=f"Request not found with id {request_id}"
        )
    return request


def get_all_orders(db: Session, restaurant_id: int):
    get_restaurant(db, restaurant_id)
    all_orders = db.query(Order).filter(
        Order.restaurantid == restaurant_id).order_by(Order.id.asc()).all()
    return all_orders


def get_orders_by_status(db: Session, restaurant_id: int, status: str):
    get_restaurant(db, restaurant_id)
    result = []
    all_orders = db.query(Order).filter(
        Order.restaurantid == restaurant_id).order_by(Order.id.asc()).all()
    for order in all_orders:
        order_items_by_status = []
        for order_item in order.orderitems:
            if order_item.orderstatus == status.lower():
                order_items_by_status.append(order_item)
        if len(order_items_by_status) != 0:
            order_copy = Order(id=order.id, tableid=order.tableid,
                               comment=order.comment,
                               restaurantid=order.restaurantid,
                               orderitems=order.orderitems,
                               ordered_at=order.ordered_at)
            order_copy.orderitems = order_items_by_status
            result.append(order_copy)
    return result


def update_request_assistance_status(
    db: Session, request_id: int
):
    db_request = get_assistance_request(db, request_id)
    key = "statusname"
    complete = "satisfied"
    if not hasattr(db_request, key):
        raise HTTPException(
            status_code=400,
            detail=f"unexpected attribute: {key}"
        )
    setattr(db_request, key, complete)
    db.commit()
    db.refresh(db_request)
    return db_request
