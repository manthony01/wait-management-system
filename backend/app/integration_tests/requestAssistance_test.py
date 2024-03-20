"""
Request assistance
"""


from .conftest import to_date_time
from ..sql_app.models.request_assistance import RequestAssistance
from ..sql_app.models.restaurant_table import RestaurantTable
import pytest


def test_request_assistance(client, create_order):
    response = client.post(
        "/customer/request-assistance",
        json={
            "tableid": 1,
            "restaurantid": 1
        }
    )

    assert response.status_code == 200

    json_response = response.json()
    assert json_response["requestid"] == 1
    assert json_response["restaurantid"] == 1
    assert json_response["tableid"] == 1
    assert json_response["statusname"] == "requesting"


def test_request_assistance_already_requested(client, create_order):
    client.post(
        "/customer/request-assistance",
        json={
            "tableid": 1,
            "restaurantid": 1
        }
    )

    response = client.post(
        "/customer/request-assistance",
        json={
            "tableid": 1,
            "restaurantid": 1
        }
    )

    assert response.status_code == 422
    assert response.json() == {
        "detail": "Request has already been sent for table 1"
    }


def test_request_assistance_invalid_restaurant(client, order_setup):
    response = client.post(
        "/customer/request-assistance",
        json={
            "tableid": 1,
            "restaurantid": 2
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Restaurant not found with id 2"
    }


def test_request_assistance_invalid_tableid(client, order_setup):
    response = client.post(
        "/customer/request-assistance",
        json={
            "tableid": 2,
            "restaurantid": 1
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "RestaurantTable not found with id 2"
    }


@pytest.fixture
def setup_requests(session, restaurant_one):
    table1 = RestaurantTable(
        tableid=1,
        restaurantid=restaurant_one.id
    )
    session.add(table1)
    session.commit()
    session.refresh(table1)

    table2 = RestaurantTable(
        tableid=2,
        restaurantid=restaurant_one.id
    )
    session.add(table2)
    session.commit()
    session.refresh(table2)

    table3 = RestaurantTable(
        tableid=3,
        restaurantid=restaurant_one.id
    )
    session.add(table3)
    session.commit()
    session.refresh(table3)


@pytest.fixture
def create_requests(session, setup_requests):
    request1 = RequestAssistance(
        tableid=1,
        restaurantid=1,
        requested_at=to_date_time("2013-03-19T23:12:00")
    )

    session.add(request1)
    session.commit()
    session.refresh(request1)

    request2 = RequestAssistance(
        tableid=2,
        restaurantid=1,
        requested_at=to_date_time("2013-03-19T23:12:00")
    )

    session.add(request2)
    session.commit()
    session.refresh(request2)
    request3 = RequestAssistance(
        tableid=3,
        restaurantid=1,
        requested_at=to_date_time("2013-03-19T23:12:00")
    )

    session.add(request3)
    session.commit()
    session.refresh(request3)


def test_get_all_assistance_requests(client, create_requests):
    response = client.get("/staff/restaurant/1/requests")
    assert response.status_code == 200
    assert response.json() == [
        {
            "requestid": 1,
            "restaurantid": 1,
            "tableid": 1,
            "requested_at": "2013-03-19T23:12:00",
            "statusname": "requesting"
        },
        {
            "requestid": 2,
            "restaurantid": 1,
            "tableid": 2,
            "requested_at": "2013-03-19T23:12:00",
            "statusname": "requesting"
        },
        {
            "requestid": 3,
            "restaurantid": 1,
            "tableid": 3,
            "requested_at": "2013-03-19T23:12:00",
            "statusname": "requesting"
        }
    ]


def test_get_all_active_requests_invalid_restaurant(client, create_requests):
    response = client.get("/staff/restaurant/2/requests")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Restaurant not found with id 2"
    }
