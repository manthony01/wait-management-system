
from ..sql_app.models.order_item import OrderItem
from ..sql_app.models.menu_item import MenuItem
"""
Tests for orders
"""

"""
Order create
"""


def check_order_response(json_response, data):
    assert json_response["ordered_at"] is not None
    del json_response["ordered_at"]
    assert json_response == data


def test_create_order(client, order_setup):
    response = client.post(
        "/customer/order",
        json={
            "tableid": 1,
            "restaurantid": 1,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 1,
                    "quantity": 1
                }
            ]
        }
    )

    assert response.status_code == 200
    json_response = response.json()
    assert json_response["ordered_at"] is not None
    del json_response["ordered_at"]
    assert json_response == {
        "id": 1,
        "tableid": 1,
        "restaurantid": 1,
        "comment": "none",
        "orderitems": [
            {
                "orderid": 1,
                "menuitemid": 1,
                "quantity": 1,
                "orderstatus": "pending"
            }
        ]
    }


def test_invalid_restaurant(client, order_setup):
    response = client.post(
        "/customer/order",
        json={
            "tableid": 1,
            "restaurantid": 2,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 1,
                    "quantity": 1
                }
            ]
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Restaurant not found with id 2"
    }


def test_invalid_tableid(client, order_setup):
    response = client.post(
        "/customer/order",
        json={
            "tableid": 2,
            "restaurantid": 1,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 1,
                    "quantity": 1
                }
            ]
        }
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "RestaurantTable not found with id 2"
    }


def test_invalid_menu_item(client, order_setup):
    response = client.post(
        "/customer/order",
        json={
            "tableid": 1,
            "restaurantid": 1,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 2,
                    "quantity": 1
                }
            ]
        }
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "MenuItem not found with id 2"
    }


"""
Order read
"""


def test_read_order(client, create_order):
    response = client.get(
        "/staff/order/1"
    )

    assert response.status_code == 200
    json_response = response.json()
    assert json_response["ordered_at"] is not None
    del json_response["ordered_at"]
    assert json_response == {
        "id": 1,
        "tableid": 1,
        "restaurantid": 1,
        "comment": "none",
        "orderitems": [
            {
                "orderid": 1,
                "menuitemid": 1,
                "quantity": 1,
                "orderstatus": "pending"
            }
        ]
    }


def test_read_order_invalid_orderid(client):
    response = client.get(
        "/staff/order/1"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Order not found with id 1"
    }


def test_read_order_item(client, create_order):
    response = client.get(
        "/staff/order/1/orderItem/1"
    )

    assert response.status_code == 200
    assert response.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "pending"
    }


def test_read_orderitem_invalid_orderid(client):
    response = client.get(
        "/staff/order/1/orderItem/1"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Order not found with id 1"
    }


def test_read_orderitem_nonexistent_menuid(client, create_order):
    response = client.get(
        "/staff/order/1/orderItem/2"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "MenuItem not found with id 2"
    }


def test_read_orderitem_invalid_menuid(session, client, create_order):
    menuItem2 = MenuItem(
        title="hello",
        description="string",
        cost=0.0,
        imagepath="string",
        ingredients="string",
        orderindex="0|aaaaa",
        categoryid=1,
        restaurantid=1
    )
    session.add(menuItem2)
    session.commit()
    session.refresh(menuItem2)

    response = client.get(
        f"/staff/order/1/orderItem/{menuItem2.id}"
    )
    assert response.status_code == 404
    assert response.json() == {
        "detail": "OrderItem not found with id 2"
    }


def test_read_all_restaurant_orders(session, client, create_order):

    menuitem = MenuItem(
        title="toast",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="bread",
        orderindex="0|aaaaa",
        categoryid=1,
        restaurantid=1
    )
    session.add(menuitem)
    session.commit()
    session.refresh(menuitem)
    assert menuitem.id == 2
    orderitem = OrderItem(
        orderid=1,
        menuitemid=menuitem.id,
        quantity=2,
        orderstatus="pending"
    )
    session.add(orderitem)
    session.commit()
    session.refresh(orderitem)

    response = client.get("/staff/restaurant/1/orderItems")
    assert response.status_code == 200
    assert response.json() == [
        {
            "orderid": 1,
            "menuitemid": 1,
            "quantity": 1,
            "orderstatus": "pending"
        },
        {
            "orderid": 1,
            "menuitemid": 2,
            "quantity": 2,
            "orderstatus": "pending"
        }
    ]


def test_read_all_restaurant_orders_by_status(session, client, create_order):
    menuitem = MenuItem(
        title="toast",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="bread",
        orderindex="0|aaaaa",
        categoryid=1,
        restaurantid=1
    )
    session.add(menuitem)
    session.commit()
    session.refresh(menuitem)
    assert menuitem.id == 2

    orderitem = OrderItem(
        orderid=1,
        menuitemid=menuitem.id,
        quantity=2,
        orderstatus="pending"
    )
    session.add(orderitem)
    session.commit()
    session.refresh(orderitem)

    menuitem1 = MenuItem(
        title="fried eggs",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="bread",
        orderindex="0|aaaaa",
        categoryid=1,
        restaurantid=1
    )
    session.add(menuitem1)
    session.commit()
    session.refresh(menuitem1)
    assert menuitem1.id == 3

    orderitem1 = OrderItem(
        orderid=1,
        menuitemid=menuitem1.id,
        quantity=2,
        orderstatus="pending"
    )
    session.add(orderitem1)
    session.commit()
    session.refresh(orderitem1)

    client.patch("/staff/order/1/orderItem/2",
                 json={
                     "orderstatus": "ready"
                 })

    response = client.get("/staff/restaurant/1/orderItems?status=pending")
    assert response.status_code == 200
    assert response.json() == [
        {
            "orderid": 1,
            "menuitemid": 1,
            "quantity": 1,
            "orderstatus": "pending"
        },
        {
            "orderid": 1,
            "menuitemid": 3,
            "quantity": 2,
            "orderstatus": "pending"
        }
    ]


def test_read_all_orders(session, client, create_multiple_orders):
    response1 = client.post(
        "/customer/order",
        json={
            "tableid": 1,
            "restaurantid": 1,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 1,
                    "quantity": 1
                },
                {
                    "menuitemid": 2,
                    "quantity": 1
                }
            ]
        }
    )
    assert response1.status_code == 200

    data1 = {
        "id": 1,
        "tableid": 1,
        "restaurantid": 1,
        "comment": "none",
        "orderitems": [
            {
                "orderid": 1,
                "menuitemid": 1,
                "quantity": 1,
                "orderstatus": "pending"
            },
            {
                "orderid": 1,
                "menuitemid": 2,
                "quantity": 1,
                "orderstatus": "pending"
            }
        ]
    }

    check_order_response(response1.json(), data1)

    response2 = client.post(
        "/customer/order",
        json={
            "tableid": 2,
            "restaurantid": 1,
            "comment": "none",
            "orderitems": [
                {
                    "menuitemid": 1,
                    "quantity": 1
                },
                {
                    "menuitemid": 2,
                    "quantity": 1
                }
            ]
        }
    )

    data2 = {
        "id": 2,
        "tableid": 2,
        "restaurantid": 1,
        "comment": "none",
        "orderitems": [
            {
                "orderid": 2,
                "menuitemid": 1,
                "quantity": 1,
                "orderstatus": "pending"
            },
            {
                "orderid": 2,
                "menuitemid": 2,
                "quantity": 1,
                "orderstatus": "pending"
            }
        ]
    }
    assert response2.status_code == 200
    check_order_response(response2.json(), data2)

    response3 = client.patch("/staff/order/1/orderItem/1", json={
        "orderstatus": "ready"
    })
    assert response3.status_code == 200

    response4 = client.get("/staff/restaurant/1/orders?status=ready")
    assert response4.status_code == 200
    check_order_response(response4.json()[0], {
        "id": 1,
        "tableid": 1,
        "restaurantid": 1,
        "comment": "none",
        "orderitems": [
            {
                "orderid": 1,
                "menuitemid": 1,
                "quantity": 1,
                "orderstatus": "ready"
            }
        ]})


def test_read_all_restaurant_orders_invalid_restaurant(client, create_order):
    response = client.get("/staff/restaurant/2/orders?status=pending")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Restaurant not found with id 2"
    }


"""
Order patch
"""


def test_update_order_status(client, create_order):
    # check initial order response
    response1 = client.get("/staff/order/1/orderItem/1")
    assert response1.status_code == 200
    assert response1.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "pending"
    }

    response2 = client.patch(
        "/staff/order/1/orderItem/1",
        json={
            "orderstatus": "ready"
        }
    )

    assert response2.status_code == 200
    assert response2.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "ready"
    }

    response3 = client.get("/staff/order/1/orderItem/1")
    assert response3.status_code == 200
    assert response3.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "ready"
    }


def test_update_order_status_using_invalid_statusname(client, create_order):
    # check initial order response
    response1 = client.get("/staff/order/1/orderItem/1")
    assert response1.status_code == 200
    assert response1.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "pending"
    }

    response2 = client.patch(
        "/staff/order/1/orderItem/1",
        json={
            "orderstatus": "brother"
        }
    )

    assert response2.status_code == 400
    assert response2.json() == {
        "detail": "Order status name is not valid: brother"
    }

    response3 = client.get("/staff/order/1/orderItem/1")
    assert response3.status_code == 200
    assert response3.json() == {
        "orderid": 1,
        "menuitemid": 1,
        "quantity": 1,
        "orderstatus": "pending"
    }
