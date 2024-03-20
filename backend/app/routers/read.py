from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from ..sql_app.models.loyalty_schema import LoyaltyProgram

from ..sql_app.models.tag import MenuItemTag, Tag

from ..sql_app.models.user import User

from ..sql_app.models.request_assistance import RequestAssistance

from ..sql_app.models.restaurant_table import RestaurantTable

from ..sql_app.models.menu_item import MenuItem
from ..sql_app.models.restaurant import Restaurant
from ..sql_app.models.category import Category
# from ..models.restaurant_table import RestaurantTable

"""
Read Restaurant
"""


def get_restaurant(db: Session, restaurant_id: int):
    restaurant = db.get(Restaurant, restaurant_id)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=f"Restaurant not found with id {restaurant_id}"
        )
    return restaurant


def get_all_restaurants(db: Session):
    all_restaurants = db.query(Restaurant).order_by(
        func.char_length(Restaurant.name), Restaurant.name).all()
    return all_restaurants


"""
Read RestaurantTable
"""


def get_restaurant_table(db: Session, restaurant_id: int, table_id: int):
    restaurant_table = db.get(RestaurantTable, (table_id, restaurant_id))
    if not restaurant_table:
        raise HTTPException(
            status_code=404,
            detail=f"RestaurantTable not found with id {table_id}"
        )
    return restaurant_table


def get_restaurant_tables(db: Session, restaurant_id: int):
    return db.query(RestaurantTable).filter(
        RestaurantTable.restaurantid == restaurant_id
    ).all()


"""
Read MenuItems
"""


def get_menu_item(db: Session, menu_item_id: int):
    menu_item = db.get(MenuItem, menu_item_id)
    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail=f"MenuItem not found with id {menu_item_id}"
        )
    return menu_item


def get_menu_items(db: Session, menu_ids):
    if menu_ids:
        return db.query(MenuItem).filter(MenuItem.id.in_(menu_ids)).all()
    return db.query(MenuItem).all()


"""
Read Category
"""


def get_category(db: Session, category_id: int):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=404,
            detail=f"Category not found with id {category_id}"
        )
    return category


"""
Read Order
"""


def get_restaurant_menu(db: Session, restaurant_id):
    restaurant = db.get(Restaurant, restaurant_id)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=f"Restaurant not found with id {restaurant_id}"
        )

    # Sort on category first
    menu = []
    categories = [category for category in restaurant.categories]
    categories.sort(key=lambda x: x.orderindex)

    for category in categories:
        category.items = []
        for menu_item in restaurant.menuitems:
            if menu_item.categoryid == category.id:
                category.items.append(menu_item)
        category.items.sort(key=lambda x: x.orderindex)
        menu.append(category)

    return menu


def get_restaurant_menu_by_tags(
    db: Session, restaurant_id: int, tags: List[int]
):
    restaurant = get_restaurant(db, restaurant_id)
    menuitems = db.query(MenuItem).join(MenuItemTag).join(Tag).filter(
        MenuItem.restaurantid == restaurant_id,
        Tag.id.in_(tags)
    ).all()
    menu = []
    categories = [category for category in restaurant.categories]
    categories.sort(key=lambda x: x.orderindex)

    for category in categories:
        category.items = []
        for menu_item in menuitems:
            if menu_item.categoryid == category.id:
                category.items.append(menu_item)
        category.items.sort(key=lambda x: x.orderindex)
        menu.append(category)
    return menu


"""
Read request id
"""


def get_most_recent_request(db: Session, table_id: int, restaurant_id: int):
    request = db.query(RequestAssistance).filter(
        RequestAssistance.tableid == table_id,
        RequestAssistance.restaurantid == restaurant_id).order_by(
        RequestAssistance.requestid.desc()).first()
    return request


"""
Read user
"""


def get_user(db: Session, email: str):
    return db.get(User, email)


"""
Read tags
"""


def get_tag(db: Session, tag_id: int):
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(
            status_code=404,
            detail=f"Tag does not exist: {tag_id}"
        )
    return tag


def get_all_given_tags(db: Session, tags: List[int]):
    for i in tags:
        print(i)
    tag_list = db.query(Tag).all()
    print(tag_list)
    return db.query(Tag).filter(Tag.id.in_(tags)).all()


def get_all_tags(db: Session):
    tags = db.query(Tag).all()
    if tags == []:
        raise HTTPException(
            status_code=404,
            detail="Tags do not exist"
        )
    return tags


"""
User Loyalty Program
"""


def get_loyalty_program(db: Session, restaurant_id: int):
    program = db.get(LoyaltyProgram, restaurant_id)
    if not program:
        raise HTTPException(
            status_code=404,
            detail="Loyalty program does not exist at restaurant"
        )
    return program
