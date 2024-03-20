# from app.sql_app.models.restaurant import Restaurant
from app.sql_app.models.restaurant_table import RestaurantTable
import pytest
from .helper import auth_http_requests

auth = auth_http_requests()


@pytest.fixture
def table_one(session, restaurant_one):
    table = RestaurantTable(
        tableid=1,
        restaurantid=restaurant_one.id
    )
    session.add(table)
    session.commit()
    session.refresh(table)
    assert table.tableid == 1
    yield table


def create_table(session, restaurant_id, table_id):
    table = RestaurantTable(
        tableid=table_id,
        restaurantid=restaurant_id
    )
    session.add(table)
    session.commit()
    session.refresh(table)
    yield table


def test_create_restaurant_table(client, restaurant_one):
    response = client.post("/manager/restaurant/table", json={
        "tableid": 10,
        "restaurantid": restaurant_one.id
    })
    assert response.status_code == 200
    assert response.json() == {
        "tableid": 10,
        "restaurantid": restaurant_one.id
    }

    response = client.get(f"/restaurant/{restaurant_one.id}/table/10")
    assert response.status_code == 200
    assert response.json() == {
        "tableid": 10,
        "restaurantid": restaurant_one.id
    }


def test_get_restaurant_table(client, table_one):
    response = client.get("/restaurant/1/table/1")
    assert response.status_code == 200
    assert response.json() == {
        "tableid": table_one.tableid,
        "restaurantid": table_one.restaurantid
    }


def test_delete_restaurant(client, table_one):
    response = client.delete("/manager/restaurant/1/table/1")
    assert response.status_code == 200
    assert response.json() == {
        "tableid": table_one.tableid,
        "restaurantid": table_one.restaurantid
    }

    response = client.get("/restaurant/1/table/1")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "RestaurantTable not found with id 1"
    }


def test_get_all_tables(client, table_one):
    response = client.get("/restaurant/1/tables")
    assert response.status_code == 200
    assert response.json() == [
        {
            "tableid": table_one.tableid,
            "restaurantid": table_one.restaurantid
        }
    ]
