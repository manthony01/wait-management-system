# from app.sql_app.models.category import Category
import pytest
from app.sql_app.models.restaurant import Restaurant
from app.integration_tests.helper import auth_http_requests

auth = auth_http_requests()


def test_create_category(client, session):
    restaurant1 = Restaurant(
        name="restaurant",
        comment="test",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)

    response = client.post(
            "/manager/category",
            json={
                "name": "Category 1",
                "restaurantid": restaurant1.id,
                "orderindex": "0|aaaa",
            }
    )

    assert response.status_code == 200
    assert response.json() == {
        "name": "Category 1",
        "restaurantid": restaurant1.id,
        "orderindex": "0|aaaa",
        "id": 1,
        "restaurant": {
            "name": "restaurant",
            "comment": "test",
            "imagepath": "test",
            "id": 1,
            "tables": [],
            "menuitems": [],
            "staff": [],
            "categories": [
                {
                    "name": "Category 1",
                    "restaurantid": restaurant1.id,
                    "orderindex": "0|aaaa",
                    "id": 1
                }
            ],
            "orders": [],
        }
    }


def test_get_invalid_category(client):
    response1 = client.get(
        "/category/1"
    )
    response2 = client.get(
        "/category/2"
    )

    assert response1.status_code == 404
    assert response1.json() == {
        "detail": "Category not found with id 1",
    }

    assert response2.status_code == 404
    assert response2.json() == {
        "detail": "Category not found with id 2"
    }


def test_auth_category_create(client_with_auth, auth_restaurant,
                              auth_login_all):
    access_token = auth_restaurant[0]
    restaurant = auth_restaurant[1]
    id = restaurant["id"]
    response = auth.post(
        client_with_auth, "/manager/category",
        {
            "name": "Category 1",
            "restaurantid": 1,
            "orderindex": "0|aaaa",
        },
        access_token
    )
    assert response.status_code == 200
    assert response.json() == {
        "name": "Category 1",
        "restaurantid": id,
        "orderindex": "0|aaaa",
        "id": 1,
        "restaurant": {
            "name": restaurant["name"],
            "comment": "test",
            "imagepath": "test",
            "id": id,
            "tables": [],
            "menuitems": [],
            "staff": [
                {
                    "email": '1@gmail.com',
                    "rolename": 'manager',
                },
            ],
            "categories": [
                {
                    "name": "Category 1",
                    "restaurantid": id,
                    "orderindex": "0|aaaa",
                    "id": 1
                }
            ],
            "orders": [],
        }
    }


@pytest.fixture
def auth_create_category(client_with_auth, auth_restaurant):
    access_token = auth_restaurant[0]
    restaurant = auth_restaurant[1]
    id = restaurant["id"]
    response = auth.post(
        client_with_auth, "/manager/category",
        {
            "name": "Category 1",
            "restaurantid": 1,
            "orderindex": "0|aaaa",
        },
        access_token
    )
    assert response.status_code == 200
    assert response.json() == {
        "name": "Category 1",
        "restaurantid": id,
        "orderindex": "0|aaaa",
        "id": 1,
        "restaurant": {
            "name": restaurant["name"],
            "comment": "test",
            "imagepath": "test",
            "id": id,
            "tables": [],
            "menuitems": [],
            "staff": [
                {
                    "email": '1@gmail.com',
                    "rolename": 'manager',
                },
            ],
            "categories": [
                {
                    "name": "Category 1",
                    "restaurantid": id,
                    "orderindex": "0|aaaa",
                    "id": 1
                }
            ],
            "orders": [],
        }
    }
    # return the manager access token
    return access_token


def test_auth_category_delete(client_with_auth, auth_create_category,
                              auth_login_all):
    url = "/manager/category/1"
    # delete valid
    response = auth.delete(
        client_with_auth,
        url,
        auth_create_category
    )
    assert response.status_code == 200
    assert response.json() == {
        "name": "Category 1",
        "restaurantid": 1,
        "orderindex": "0|aaaa",
        "id": 1
    }


def test_auth_category_patch(client_with_auth, auth_create_category,
                             auth_login_all):
    url = "/manager/category/1"
    # delete valid
    newname = "helloworld"
    response = auth.patch(
        client_with_auth,
        url,
        {
            "name": newname
        },
        auth_create_category
    )
    assert response.status_code == 200
    assert response.json() == {
        "name": newname,
        "restaurantid": 1,
        "orderindex": "0|aaaa",
        "id": 1
    }
