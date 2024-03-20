from app.sql_app.models.category import Category
from app.sql_app.models.restaurant import Restaurant
import pytest


@pytest.fixture
def add_menu_item(session, client):
    # adds menu item after initialising restaurant and category.
    restaurant1 = Restaurant(
        name="Restaurant 1",
        comment="Hello",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)

    category1 = Category(
        name="Category 1",
        restaurantid=restaurant1.id,
        orderindex="0|aaaa"
    )
    session.add(category1)
    session.commit()
    session.refresh(category1)

    response = client.post(
        "/manager/menuItem",
        json={
            "title": "string",
            "description": "string",
            "cost": "0.0",
            "imagepath": "string",
            "ingredients": "string",
            "orderindex": "0|aaaaa",
            "categoryid": str(category1.id),
            "restaurantid": str(restaurant1.id)
        }
    )
    expectedResponse = {
        "title": "string",
        "description": "string",
        "cost": 0.0,
        "imagepath": "string",
        "ingredients": "string",
        "orderindex": "0|aaaaa",
        "categoryid": category1.id,
        "restaurantid": restaurant1.id,
        "id": 1,
        "category": {
            "name": category1.name,
            "restaurantid": restaurant1.id,
            "orderindex": category1.orderindex,
            "id": category1.id
        },
        'restaurant': {
            'categories': [
                {
                    'id': 1,
                    'name': 'Category 1',
                    'orderindex': '0|aaaa',
                    'restaurantid': 1
                }
            ],
            'comment': 'Hello',
            'id': 1,
            'imagepath': 'test',
            'menuitems': [
                {
                    'categoryid': 1,
                    'cost': 0.0,
                    'description': 'string',
                    'id': 1,
                    'imagepath': 'string',
                    'ingredients': 'string',
                    'orderindex': '0|aaaaa',
                    'restaurantid': 1,
                    'title': 'string'
                }
            ],
            'name': 'Restaurant 1',
            'orders': [],
            'staff': [],
            'tables': []},
        'tags': [],
    }
    assert response.status_code == 200
    assert response.json() == expectedResponse
    return expectedResponse


def test_create_menu_item(session, client):
    # create menu item
    restaurant1 = Restaurant(
        name="Restaurant 1",
        comment="Hello",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)

    category1 = Category(
        name="Category 1",
        restaurantid=restaurant1.id,
        orderindex="0|aaaa"
    )
    session.add(category1)
    session.commit()
    session.refresh(category1)

    response = client.post(
        "/manager/menuItem",
        json={
            "title": "string",
            "description": "string",
            "cost": "0.0",
            "imagepath": "string",
            "ingredients": "string",
            "orderindex": "0|aaaaa",
            "categoryid": str(category1.id),
            "restaurantid": str(restaurant1.id)
        }
    )
    assert response.status_code == 200
    assert response.json() == {
        "title": "string",
        "description": "string",
        "cost": 0.0,
        "imagepath": "string",
        "ingredients": "string",
        "orderindex": "0|aaaaa",
        "categoryid": category1.id,
        "restaurantid": restaurant1.id,
        "id": 1,
        "category": {
            "name": category1.name,
            "restaurantid": restaurant1.id,
            "orderindex": category1.orderindex,
            "id": category1.id
        },
        'restaurant': {
            'categories': [
                {
                    'id': 1,
                    'name': 'Category 1',
                    'orderindex': '0|aaaa',
                    'restaurantid': 1
                }
            ],
            'comment': 'Hello',
            'id': 1,
            'imagepath': 'test',
            'menuitems': [
                {
                    'categoryid': 1,
                    'cost': 0.0,
                    'description': 'string',
                    'id': 1,
                    'imagepath': 'string',
                    'ingredients': 'string',
                    'orderindex': '0|aaaaa',
                    'restaurantid': 1,
                    'title': 'string'
                }
            ],
            'name': 'Restaurant 1',
            'orders': [],
            'staff': [],
            'tables': []},
        'tags': [],
    }


def test_get_menu_item(client, add_menu_item):
    response = client.get(
        "/menuItem/1"
    )

    assert response.status_code == 200
    assert response.json() == {
        "title": "string",
        "description": "string",
        "cost": 0.0,
        "imagepath": "string",
        "ingredients": "string",
        "orderindex": "0|aaaaa",
        "categoryid": 1,
        "restaurantid": 1,
        "id": 1,
        "category": {
            'id': 1,
            'name': 'Category 1',
            'orderindex': '0|aaaa',
            'restaurantid': 1
        },
        'restaurant': {
            'categories': [
                {
                    'id': 1,
                    'name': 'Category 1',
                    'orderindex': '0|aaaa',
                    'restaurantid': 1
                }
            ],
            'comment': 'Hello',
            'id': 1,
            'imagepath': 'test',
            'menuitems': [
                {
                    'categoryid': 1,
                    'cost': 0.0,
                    'description': 'string',
                    'id': 1,
                    'imagepath': 'string',
                    'ingredients': 'string',
                    'orderindex': '0|aaaaa',
                    'restaurantid': 1,
                    'title': 'string'
                }
            ],
            'name': 'Restaurant 1',
            'orders': [],
            'staff': [],
            'tables': []},
        'tags': [],
    }

    assert response.json() == add_menu_item


def test_get_invalid_menu_item(client, restaurant_one):
    response = client.get(
        "/menuItem/1"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "MenuItem not found with id 1"
    }


def test_delete_menu_item(client, add_menu_item):
    response = client.delete(
        "/manager/menuItem/1",
    )

    assert response.status_code == 200
    assert response.json() == {
        "title": "string",
        "description": "string",
        "cost": 0,
        "imagepath": "string",
        "ingredients": "string",
        "orderindex": "0|aaaaa",
        "categoryid": 1,
        "restaurantid": 1,
        "id": 1,
    }


def test_delete_invalid_menu_item(client):
    response = client.delete(
        "/manager/menuItem/1"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "MenuItem not found with id 1"
    }


def test_patch_menu_item(client, add_menu_item):
    # patch menu item
    response = client.patch(
        "/manager/menuItem/1",
        json={
            "title": "new",
            "description": "new",
            "ingredients": "new",
            "imagepath": "new",
            "cost": 100.0,
            "orderindex": "new"
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "title": "new",
        "description": "new",
        "cost": 100.0,
        "imagepath": "new",
        "ingredients": "new",
        "orderindex": "new",
        "categoryid": 1,
        "restaurantid": 1,
        "id": 1,
        "tags": [],
    }

    # check menu item is changed
    response = client.get(
        "/menuItem/1"
    )

    assert response.status_code == 200
    assert response.json() == {
        "title": "new",
        "description": "new",
        "cost": 100.0,
        "imagepath": "new",
        "ingredients": "new",
        "orderindex": "new",
        "categoryid": 1,
        "restaurantid": 1,
        "id": 1,
        "category": {
            'id': 1,
            'name': 'Category 1',
            'orderindex': '0|aaaa',
            'restaurantid': 1
        },
        'restaurant': {
            'categories': [
                {
                    'id': 1,
                    'name': 'Category 1',
                    'orderindex': '0|aaaa',
                    'restaurantid': 1
                }
            ],
            'comment': 'Hello',
            'id': 1,
            'imagepath': 'test',
            'menuitems': [
                {
                    'categoryid': 1,
                    'cost': 100.0,
                    'description': 'new',
                    'id': 1,
                    'imagepath': 'new',
                    'ingredients': 'new',
                    'orderindex': 'new',
                    'restaurantid': 1,
                    'title': 'new'
                }
            ],
            'name': 'Restaurant 1',
            'orders': [],
            'staff': [],
            'tables': []},
        'tags': [],
    }


def test_get_menu_items(client, add_menu_item):
    response = client.get("/menuItems")
    assert response.status_code == 200
    assert response.json() == [{
        "id": 1,
        "title": "string",
        "description": "string",
        "cost": 0.0,
        "imagepath": "string",
        "ingredients": "string",
        "orderindex": "0|aaaaa",
        "categoryid": 1,
        "restaurantid": 1
    }]
