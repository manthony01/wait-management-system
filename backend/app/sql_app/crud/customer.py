from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.sql_app.models.user import User
from app.sql_app.models.loyalty_schema import (
    LoyaltyProgram, UserLoyaltyProgram
)
from app.sql_app.models.menu_item import MenuItem


from ..models.order_item import OrderItem
from ..models.request_assistance import RequestAssistance
from ..models.order import Order

from ..schemas.restaurant import (
    OrderCreate, OrderWithRestaurant,
    RequestAssistanceCreate, RestaurantWithId, UserPoints
)
from app.routers.read import (
    get_menu_item,
    get_restaurant,
    get_restaurant_table,
    get_most_recent_request,
    get_loyalty_program
)


def get_customer_with_order_id(
    db: Session,
    email: str,
    order_id: int
):
    user = db.query(User).join(Order).filter(
        User.email == email,
        Order.id == order_id
    ).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"Customer ({email}) did not make order: {order_id}"
        )
    return user


def verify_customer_with_order(db: Session, user: User, order_id: int):
    get_customer_with_order_id(db, user.email, order_id)


def add_points(db: Session, user: User, restaurant_id: int, points: int):
    # exit if loyalty program does not exist
    program = db.get(LoyaltyProgram, restaurant_id)
    if not program:
        return
    user_points = db.query(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.userid == user.email,
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).first()
    if not user_points:
        db_user = db.get(User, user.email)
        program.users.append(db_user)
        db.add(program)
        db.commit()
        db.refresh(program)
    total_points = user_points[2] + points
    # update points value
    db.query(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.userid == user.email,
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).update({"points": total_points}, synchronize_session='evaluate')
    return user_points


def get_order_bill(db: Session, order_id: int):
    order = db.query(OrderItem, MenuItem).join(MenuItem).filter(
        OrderItem.orderid == order_id).all()
    total_cost = 0
    for order_item, menu_item in order:
        total_cost += order_item.quantity * menu_item.cost
    return total_cost


def create_order(db: Session, user: User, order: OrderCreate):
    # check restaurant exists
    get_restaurant(db, order.restaurantid)

    # check restauranttable exists
    get_restaurant_table(db, order.restaurantid, order.tableid)

    # create and persist order into database
    db_order = None
    if not user:
        db_order = Order(
            tableid=order.tableid,
            restaurantid=order.restaurantid,
            comment=order.comment,
            ordered_at=datetime.now(),
        )
    else:
        db_order = Order(
            tableid=order.tableid,
            restaurantid=order.restaurantid,
            comment=order.comment,
            ordered_at=datetime.now(),
            ordered_by=user.email
        )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # add order items and raise 404 if menu items do not exist
    all_order_items = []

    loyalty_program = db.get(LoyaltyProgram, order.restaurantid)
    if not loyalty_program:
        for orderItem in order.orderitems:
            # check if menu item exists
            menu_item = get_menu_item(db, orderItem.menuitemid)
            db_order_item = OrderItem(
                orderid=db_order.id,
                menuitemid=orderItem.menuitemid,
                quantity=orderItem.quantity,
                orderstatus="pending"
            )
            all_order_items.append(db_order_item)
    else:
        points = 0
        money_to_points = loyalty_program.multiplier
        for orderItem in order.orderitems:
            # check if menu item exists
            menu_item = get_menu_item(db, orderItem.menuitemid)
            points += menu_item.cost * money_to_points * orderItem.quantity
            db_order_item = OrderItem(
                orderid=db_order.id,
                menuitemid=orderItem.menuitemid,
                quantity=orderItem.quantity,
                orderstatus="pending"
            )
            all_order_items.append(db_order_item)
        # add points to ther user profile
        add_points(db, user, order.restaurantid, points)
    db.add_all(all_order_items)
    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Order not found with id {order_id}"
        )
    return order


def get_all_customer_orders(db: Session, user: User):
    orders = db.query(Order).join(User).filter(
        Order.ordered_by == user.email
    ).order_by(Order.id.desc()).all()
    result = []
    for order in orders:
        restaurant = order.restaurant
        basic_restaurant = RestaurantWithId(
            id=restaurant.id,
            name=restaurant.name,
            comment=restaurant.comment,
            imagepath=restaurant.imagepath
        )
        db_order = OrderWithRestaurant(
            id=order.id,
            tableid=order.tableid,
            comment=order.comment,
            restaurantid=order.restaurantid,
            ordered_at=order.ordered_at,
            orderitems=order.orderitems,
            restaurant=basic_restaurant
        )
        result.append(db_order)
    return result


def get_customer_orders_by_status(db: Session, user: User, status: str):
    # states to check
    completed_state = ["served"]
    pending_state = ["pending", "ready"]
    orders = db.query(Order).join(User).filter(
        User.email == user.email
    )
    orders_by_status = []
    for order in orders:
        result = []
        for order_item in order.orderitems:
            status_state = pending_state
            if status.lower() == "completed":
                status_state = completed_state
            if order_item.orderstatus in status_state:
                result.append(order_item)
        if len(result) != 0:
            restaurant = order.restaurant
            basic_restaurant = RestaurantWithId(
                id=restaurant.id,
                name=restaurant.name,
                comment=restaurant.comment,
                imagepath=restaurant.imagepath
            )
            db_order = OrderWithRestaurant(
                id=order.id,
                tableid=order.tableid,
                comment=order.comment,
                restaurantid=order.restaurantid,
                ordered_at=order.ordered_at,
                orderitems=result,
                restaurant=basic_restaurant
            )
            orders_by_status.append(db_order)
    return orders_by_status


def request_assistance(db: Session, request: RequestAssistanceCreate):
    # validate the data
    get_restaurant(db, request.restaurantid)
    get_restaurant_table(db, request.restaurantid, request.tableid)
    most_recent = get_most_recent_request(db, request.tableid,
                                          request.restaurantid)
    if (most_recent) and (most_recent.statusname == "requesting"):
        raise HTTPException(
            status_code=422,
            detail=(
                f"Request has already been sent for table {request.tableid}"
            )
        )
    db_request = RequestAssistance(
        tableid=request.tableid,
        restaurantid=request.restaurantid,
        requested_at=datetime.now()
    )

    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_user_points(db: Session, user: User, restaurant_id: int):
    program = get_loyalty_program(db, restaurant_id)
    user_points = db.query(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.userid == user.email,
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).first()
    if not user_points:
        db_user = db.get(User, user.email)
        program.users.append(db_user)
        db.add(program)
        db.commit()
        db.refresh(program)
    user_points = db.query(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.userid == user.email,
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).first()
    user_response = UserPoints(
        email=user_points[0],
        restaurantid=user_points[1],
        points=user_points[2],
        discount=program.discount
    )
    return user_response


def apply_user_points(db: Session, user: User, restaurant_id: int):
    loyalty_program = get_loyalty_program(db, restaurant_id)
    user_points = db.query(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.userid == user.email,
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).first()
    if not user_points:
        raise HTTPException(
            status_code=404,
            detail="User does not own loyalty account at this restaurant"
        )
    points = user_points[2]
    if points >= loyalty_program.minimum:
        # deduct points
        new_points = points - loyalty_program.minimum
        db.query(UserLoyaltyProgram).filter(
            UserLoyaltyProgram.c.userid == user.email,
            UserLoyaltyProgram.c.restaurantid == restaurant_id
        ).update({"points": new_points}, synchronize_session='evaluate')
        db.commit()
        user_response = UserPoints(
            email=user.email,
            points=new_points,
            restaurantid=restaurant_id,
            discount=loyalty_program.discount
        )
        return user_response
    else:
        raise HTTPException(
            status_code=403,
            detail=("User points below minimum required to redeem discount: "
                    f"{loyalty_program.minimum}")
        )
