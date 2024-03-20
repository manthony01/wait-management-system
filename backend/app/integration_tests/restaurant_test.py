from app.sql_app.models.restaurant import Restaurant
from app.integration_tests.helper import auth_http_requests

auth = auth_http_requests()


def test_create_restaurant(client, manager_1):
    response = client.post("/manager/restaurant", json={
        "name": "CC Train",
        "comment": "test",
        "imagepath": "test"
    })

    assert response.status_code == 200
    assert response.json() == {
        "name": "CC Train",
        "comment": "test",
        "imagepath": "test",
        "id": 1,
        "tables": [],
        "menuitems": [],
        "staff": [],
        "categories": [],
        "orders": []
    }


def test_get_restaurant(session, client, restaurant_one):
    response = client.get("/restaurant/1")
    assert response.status_code == 200
    assert response.json() == {
        "name": restaurant_one.name,
        "comment": restaurant_one.comment,
        "id": restaurant_one.id,
        "imagepath": restaurant_one.imagepath,
        "tables": [],
        "menuitems": [],
        "staff": [],
        "categories": [],
        "orders": []
    }


def test_get_all_restaurants(session, client):
    restaurant_1 = Restaurant(
        name="Restaurant 1",
        comment="Test",
        imagepath="test"
    )
    session.add(restaurant_1)
    session.commit()
    session.refresh(restaurant_1)

    restaurant_2 = Restaurant(
        name="Restaurant 2",
        comment="Test",
        imagepath="test"
    )
    session.add(restaurant_2)
    session.commit()
    session.refresh(restaurant_2)

    response = client.get("/restaurants")
    assert response.status_code == 200
    assert response.json() == [
            {
                "name": restaurant_1.name,
                "comment": restaurant_1.comment,
                "imagepath": restaurant_1.imagepath,
                "id": restaurant_1.id,
                "tables": [],
                "menuitems": [],
                "staff": [],
                "categories": [],
                "orders": []
            },
            {
                "name": restaurant_2.name,
                "comment": restaurant_2.comment,
                "imagepath": restaurant_2.imagepath,
                "id": restaurant_2.id,
                "tables": [],
                "menuitems": [],
                "staff": [],
                "categories": [],
                "orders": []
            }
    ]


def test_restaurant_ordered_by_length(session, client):
    restaurant_1 = Restaurant(
        name="homie",
        comment="Test",
        imagepath="test"
    )
    session.add(restaurant_1)
    session.commit()
    session.refresh(restaurant_1)

    restaurant_2 = Restaurant(
        name="restaurant 1",
        comment="Test",
        imagepath="test"
    )
    session.add(restaurant_2)
    session.commit()
    session.refresh(restaurant_2)

    restaurant_3 = Restaurant(
        name="test",
        comment="Test",
        imagepath="test",
    )
    session.add(restaurant_3)
    session.commit()
    session.refresh(restaurant_3)

    restaurant_4 = Restaurant(
        name="tamo",
        comment="Test",
        imagepath="test"
    )
    session.add(restaurant_4)
    session.commit()
    session.refresh(restaurant_4)
    # expected restaurant ordering: 4, 3, 1, 2
    response = client.get("/restaurants")
    assert response.status_code == 200
    assert response.json() == [
        {
            "name": restaurant_4.name,
            "comment": restaurant_4.comment,
            "id": restaurant_4.id,
            "imagepath": restaurant_4.imagepath,
            "tables": [],
            "menuitems": [],
            "staff": [],
            "categories": [],
            "orders": []
        },
        {
            "name": restaurant_3.name,
            "comment": restaurant_3.comment,
            "imagepath": restaurant_3.imagepath,
            "id": restaurant_3.id,
            "tables": [],
            "menuitems": [],
            "staff": [],
            "categories": [],
            "orders": []
        },
        {
            "name": restaurant_1.name,
            "comment": restaurant_1.comment,
            "imagepath": restaurant_1.imagepath,
            "id": restaurant_1.id,
            "tables": [],
            "menuitems": [],
            "staff": [],
            "categories": [],
            "orders": []
        },
        {
            "name": restaurant_2.name,
            "comment": restaurant_2.comment,
            "imagepath": restaurant_2.imagepath,
            "id": restaurant_2.id,
            "tables": [],
            "menuitems": [],
            "staff": [],
            "categories": [],
            "orders": []
        }
    ]


def test_delete_restaurant(session, client, restaurant_one):
    response = client.delete(f"/manager/restaurant/{restaurant_one.id}")
    assert response.status_code == 200
    assert response.json() == {
        "name": restaurant_one.name,
        "comment": restaurant_one.comment,
        "imagepath": restaurant_one.imagepath,
        "id": restaurant_one.id,
        "tables": [],
        "menuitems": [],
        "staff": [],
        "categories": [],
        "orders": []
    }


def test_auth_create_restaurant(
    client_with_auth, auth_login_manager, auth_login_all
):
    token = auth_login_manager[0]
    manager_token = token["access_token"]
    url = "/manager/restaurant"
    data = {
            "name": "CC Train",
            "comment": "test",
            "imagepath": "test"
    }
    # create restaurant
    response = auth.post(
        client_with_auth, url,
        data,
        manager_token
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "name": "CC Train",
        "comment": "test",
        "imagepath": "test",
        "tables": [],
        "menuitems": [],
        "staff": [
            {
                "email": '1@gmail.com',
                "rolename": 'manager',
            },
        ],
        "categories": [],
        "orders": []
    }

    # check permissions

    # waiter_token = auth_login_all[0]["access_token"]
    # chef_token = auth_login_all[1]["access_token"]
    # customer_token = auth_login_all[2]["access_token"]
    # auth.post_protected(client_with_auth, url, data, waiter_token)
    # auth.post_protected(client_with_auth, url, data, chef_token)
    # auth.post_protected(client_with_auth, url, data, customer_token)


def test_auth_delete_restaurant(
    client_with_auth, auth_create_restaurant, auth_login_all
):
    token_response = auth_create_restaurant[0]
    manager_token = token_response["access_token"]
    restaurant = auth_create_restaurant[1]

    rest_id = restaurant['id']
    url = f"/manager/restaurant/{rest_id}"

    # delete restaurant
    response1 = auth.delete(
        client_with_auth,
        url,
        manager_token
    )

    assert response1.status_code == 200
    assert response1.json() == {
        "id": 1,
        "name": "CC Train",
        "comment": "test",
        "imagepath": "test",
        "tables": [],
        "menuitems": [],
        "staff": [
            {
                "email": "1@gmail.com",
                "rolename": "manager",
            }
        ],
        "categories": [],
        "orders": []
    }

    # check restaurant was deleted
    response2 = auth.get(
        client_with_auth,
        f"/restaurant/{rest_id}",
        manager_token
    )

    assert response2.json() == {
        "detail": f"Restaurant not found with id {rest_id}"
    }
    assert response2.status_code == 404

    # # check if endpoint is protected
    # waiter_token = auth_login_all[0]["access_token"]
    # chef_token = auth_login_all[1]["access_token"]
    # customer_token = auth_login_all[2]["access_token"]
    # auth.delete_protected(client_with_auth, url, waiter_token)
    # auth.delete_protected(client_with_auth, url, chef_token)
    # auth.delete_protected(client_with_auth, url, customer_token)


def test_auth_patch_restaurant(
    client_with_auth, auth_create_restaurant, auth_login_all
):
    token_response = auth_create_restaurant[0]
    manager_token = token_response["access_token"]
    restaurant = auth_create_restaurant[1]

    rest_id = restaurant['id']
    url = f"/manager/restaurant/{rest_id}"

    # patch restaurant
    data = {
        "name": "new",
    }
    response1 = auth.patch(
        client_with_auth,
        url,
        data,
        manager_token
    )

    assert response1.status_code == 200
    assert response1.json() == {
        "id": 1,
        "name": "new",
        "comment": "test",
        "imagepath": "test",
        "tables": [],
        "menuitems": [],
        "staff": [
            {
                "email": "1@gmail.com",
                "rolename": "manager",
            }
        ],
        "categories": [],
        "orders": []
    }

    # waiter_token = auth_login_all[0]["access_token"]
    # chef_token = auth_login_all[1]["access_token"]
    # customer_token = auth_login_all[2]["access_token"]
    # auth.patch_protected(client_with_auth, url, data, waiter_token)
    # auth.patch_protected(client_with_auth, url, data, chef_token)
    # auth.patch_protected(client_with_auth, url, data, customer_token)
