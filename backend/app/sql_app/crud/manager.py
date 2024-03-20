from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.sql_app.models.user import User
from app.integration_tests.helper import Roles
from app.auth import security
from app.routers.read import get_loyalty_program
from app.sql_app.models.loyalty_schema import (
    LoyaltyProgram, UserLoyaltyProgram
)

from ..schemas.user import UserWithRole

from ..models.staff import Staff

from ..models.menu_item import MenuItem
from ..models.restaurant import Restaurant
from ..models.category import Category
from ..models.restaurant_table import RestaurantTable
from ..schemas.restaurant import (
    CategoryPatch, LoyaltyProgramCreate, LoyaltyProgramPatch,
    MenuItemCreate, MenuItemPatch,
    CategoryCreate, RestaurantCreate, RestaurantPatch,
    RestaurantTableCreate, StaffAdd,
    UserWithProgram

)
from app.routers.read import (
    get_restaurant,
    get_menu_item,
    get_category,
    get_tag,
    get_all_given_tags
)


def verify_manager_owns_restaurant(
    db: Session, user: User, restaurant_id: int
):
    if not user:
        return
    manager = db.get(Staff, (user.email, Roles.MANAGER))

    restaurant = get_restaurant(db, restaurant_id)
    if (manager not in restaurant.staff):
        raise HTTPException(
            status_code=404,
            detail=f"User does not own restaurant: {restaurant_id}"
        )


def verify_manager_owns_category(
    db: Session, user: User, category_id: int
):
    if not user:
        return
    category = get_category(db, category_id)
    restaurant_id = category.restaurantid
    verify_manager_owns_restaurant(db, user, restaurant_id)


def get_all_restaurants(
    db: Session, user: User
):
    manager = db.get(Staff, (user.email, Roles.MANAGER))
    return manager.restaurants


def create_restaurant(
    db: Session, user: User, restaurant: RestaurantCreate
):
    db_restaurant = Restaurant(
        name=restaurant.name,
        comment=restaurant.comment,
        imagepath=restaurant.imagepath
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)

    if not user:
        return db_restaurant

    db_staff = db.get(Staff, (user.email, Roles.MANAGER))
    db_restaurant.staff.append(db_staff)
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def delete_restaurant(db: Session, restaurant_id):
    restaurant = get_restaurant(db, restaurant_id)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=f"Restaurant not found with id {restaurant_id}"
        )
    db.delete(restaurant)
    db.commit()
    return restaurant


def update_restaurant(
    db: Session, restaurant_id: int, restaurant: RestaurantPatch
):
    db_restaurant = get_restaurant(db, restaurant_id)

    data = restaurant.dict(exclude_unset=True)

    for key, value in data.items():
        if not hasattr(db_restaurant, key):
            raise HTTPException(
                status_code=400,
                detail=f"unexpected attribute: {key}"
            )
        setattr(db_restaurant, key, value)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def create_restaurant_table(
    db: Session,
    restaurant_table: RestaurantTableCreate
):
    t_id, r_id = restaurant_table.tableid, restaurant_table.restaurantid
    restaurant = db.get(Restaurant, r_id)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=(f"Restaurant not found with id {r_id}")
        )

    table = db.get(RestaurantTable, (t_id, r_id))
    if table:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Table already exists with table, restaurant: {t_id}, {r_id}"
            )
        )

    db_restaurant_table = RestaurantTable(
        restaurantid=restaurant_table.restaurantid,
        tableid=restaurant_table.tableid
    )
    db.add(db_restaurant_table)
    db.commit()
    db.refresh(db_restaurant_table)
    return db_restaurant_table


def delete_restaurant_table(
    db: Session,
    restaurant_id: int,
    table_id: int
):
    table = db.get(RestaurantTable, (table_id, restaurant_id))
    if not table:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Table not found with "
                f"table, restaurant: {table_id}, {restaurant_id}"
            )
        )
    db.delete(table)
    db.commit()
    return table


def create_menu_item(db: Session, menu_item: MenuItemCreate):
    get_restaurant(db, menu_item.restaurantid)
    get_category(db, menu_item.categoryid)
    menu_tags = get_all_given_tags(db, menu_item.tags)
    db_menu_item = MenuItem(
        title=menu_item.title,
        description=menu_item.description,
        cost=menu_item.cost,
        imagepath=menu_item.imagepath,
        ingredients=menu_item.ingredients,
        orderindex=menu_item.orderindex,
        categoryid=menu_item.categoryid,
        restaurantid=menu_item.restaurantid,
        tags=menu_tags
    )

    if len(menu_item.tags) > 0:
        tag_list = []
        for tag_id in menu_item.tags:
            tag = get_tag(db, tag_id)
            tag_list.append(tag)
        db_menu_item.tags = tag_list
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item


def delete_menu_item(db: Session, menu_item_id):
    menu_item = get_menu_item(db, menu_item_id)
    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail=f"MenuItem not found with id {menu_item_id}"
        )
    db.delete(menu_item)
    db.commit()
    return menu_item


def patch_menu_item(db: Session, menu_item_id, menu_item: MenuItemPatch):
    db_menu_item = get_menu_item(db, menu_item_id)
    if not db_menu_item:
        raise HTTPException(
            status_code=404,
            detail=f"MenuItem not found with id {menu_item_id}"
        )
    menu_data = menu_item.dict(exclude_unset=True)
    for key, value in menu_data.items():
        if not hasattr(db_menu_item, key):
            raise HTTPException(
                status_code=400,
                detail=f"unexpected attribute: {key}"
            )
        if key == "tags":
            all_tags = get_all_given_tags(db, value)
            setattr(db_menu_item, key, all_tags)
        else:
            setattr(db_menu_item, key, value)
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item


# TODO
def create_category(db: Session, category: CategoryCreate):
    restaurant = get_restaurant(db, category.restaurantid)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=f"Restaurant not found with id {category.restaurantid}"
        )
    db_category = Category(
        name=category.name,
        restaurantid=category.restaurantid,
        orderindex=category.orderindex
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    category = get_category(db, category_id)

    num_menuitems = len(category.menuitems)
    if len(category.menuitems) > 0:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot delete category containing menu-items: "
                f"{num_menuitems}"
            )
        )
    db.delete(category)
    db.commit()
    return category


def patch_category(
    db: Session,
    category_id: int,
    category_patch: CategoryPatch
):
    db_category = get_category(db, category_id)
    if not db_category:
        raise HTTPException(
            status_code=404,
            detail=f"Category not found with id {category_id}"
        )
    patch = category_patch.dict(exclude_unset=True)
    for attr, new_value in patch.items():
        if not hasattr(db_category, attr):
            raise HTTPException(
                status_code=400,
                detail=f"unexpected attribute: {attr}"
            )
        setattr(db_category, attr, new_value)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_all_staff(db: Session, restaurant_id: int):
    restaurant = get_restaurant(db, restaurant_id)
    result = []
    for member in restaurant.staff:
        user = db.get(User, member.email)
        user_result = UserWithRole(
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email,
            imagepath=user.imagepath,
            role=member.rolename,
        )
        result.append(user_result)
    return result


def get_all_staff_by_role(db: Session, restaurant_id: int, role: str):
    restaurant = get_restaurant(db, restaurant_id)
    result = []
    for member in restaurant.staff:
        if member.rolename == role.lower():
            user = db.get(User, member.email)
            user_result = UserWithRole(
                firstname=user.firstname,
                lastname=user.lastname,
                email=user.email,
                imagepath=user.imagepath,
                role=role
            )
            result.append(user_result)
    return result


def get_staff(db: Session, restaurant_id: int, email: str, role: str):
    security.check_valid_scopes(role)
    staff = db.get(Staff, (email, role))
    if not staff:
        raise HTTPException(
            status_code=404,
            detail=f"Staff does not exist: {restaurant_id}"
        )
    return staff


def add_staff(db: Session, restaurant_id: int, user: UserWithRole,
              staff: StaffAdd):
    restaurant = get_restaurant(db, restaurant_id)
    db_staff = get_staff(db, restaurant_id, staff.email, staff.role)
    if db_staff in restaurant.staff:
        raise HTTPException(
            status_code=404,
            detail=f"Staff already works at restaurant: {restaurant_id}"
        )
    restaurant.staff.append(db_staff)
    db.add(restaurant)
    db.commit()
    db.refresh(db_staff)
    return db_staff


def delete_staff(
    db: Session, restaurant_id: int, user: UserWithRole, staff: StaffAdd
):
    restaurant = get_restaurant(db, restaurant_id)
    db_staff = get_staff(db, restaurant_id, staff.email, staff.role)

    if user.email == db_staff.email and user.role == db_staff.rolename:
        raise HTTPException(
            status_code=404,
            detail=(
                "Manager cannot remove themselves from restaurant: "
                + str(restaurant_id)
            )
        )

    if db_staff in restaurant.staff:
        restaurant.staff.remove(db_staff)
        db.add(restaurant)
        db.commit()
        db.refresh(db_staff)
        return db_staff
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Staff does not work at restaurant: {restaurant_id}"
        )


"""
Loyalty Program
"""


def get_users_in_loyalty_program(db: Session, restaurant_id: int):
    get_loyalty_program(db, restaurant_id)
    users = db.query(
        UserLoyaltyProgram, User
    ).select_from(User).join(UserLoyaltyProgram).filter(
        UserLoyaltyProgram.c.restaurantid == restaurant_id
    ).all()
    result = []
    for user_tuple in users:
        restaurant_id = user_tuple[1]
        points = user_tuple[2]
        user = user_tuple[3]
        user_with_program = UserWithProgram(
            restaurantid=restaurant_id,
            points=points,
            user=user
        )
        result.append(user_with_program)
    return result


def create_loyalty_program(db: Session, program: LoyaltyProgramCreate):
    restaurant_id = program.restaurantid
    curr_program = db.get(LoyaltyProgram, restaurant_id)
    if curr_program:
        raise HTTPException(
            status_code=401,
            detail="program already exists"
        )
    new_program = LoyaltyProgram(
        restaurantid=program.restaurantid,
        minimum=program.minimum,
        discount=program.discount,
        multiplier=program.multiplier
    )
    db.add(new_program)
    db.commit()
    db.refresh(new_program)
    return new_program


def update_loyalty_program(db: Session, program: LoyaltyProgramPatch):
    restaurant_id = program.restaurantid
    curr_program = get_loyalty_program(db, restaurant_id)
    program_values = program.dict(exclude_unset=True)
    for key, value in program_values.items():
        if not hasattr(curr_program, key):
            raise HTTPException(
                status_code=400,
                detail=f"unexpected attribute: {key}"
            )
        setattr(curr_program, key, value)
    db.add(curr_program)
    db.commit()
    db.refresh(curr_program)
    return curr_program


def delete_loyalty_program(db: Session, restaurant_id: int):
    curr_program = get_loyalty_program(db, restaurant_id)
    db.remove(curr_program)
    db.commit()
    db.refresh(curr_program)
    return curr_program
