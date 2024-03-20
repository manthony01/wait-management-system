import pytest
from fastapi.testclient import TestClient

from ..integration_tests.helper import Roles, auth_http_requests

from ..sql_app.models.category import Category
from ..sql_app.models.menu_item import MenuItem
from ..sql_app.models.order import Order
from ..sql_app.models.order_item import OrderItem
from ..sql_app.models.restaurant_table import RestaurantTable
from datetime import datetime
from ..sql_app.models.restaurant import Restaurant
from ..sql_app.database import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from passlib.context import CryptContext
from ..main import app
from ..sql_app.database import get_db
from ..auth.security import get_current_user

roles = Roles()
auth = auth_http_requests()


def to_date_time(string):
    return datetime.strptime(string, '%Y-%m-%dT%H:%M:%S')


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False,
                                       bind=engine)
    Base.metadata.create_all(bind=engine)
    yield TestingSessionLocal()


@pytest.fixture(name="client", scope="function")
def client_fixture(session):
    def get_session_override():
        return session

    def get_current_user_override():
        pass
    app.dependency_overrides[get_db] = get_session_override
    app.dependency_overrides[get_current_user] = get_current_user_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="client_with_auth", scope="function")
def client_with_auth_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def restaurant_one(session):
    restaurant1 = Restaurant(
        name="Restaurant 1",
        comment="Hello",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)
    assert restaurant1.id == 1
    yield restaurant1


# creates restaurant, restaurant table, category and menu item
@pytest.fixture
def order_setup(session):
    restaurant1 = Restaurant(
        name="Restaurant 1",
        comment="Hello",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)

    table1 = RestaurantTable(
        tableid=1,
        restaurantid=restaurant1.id
    )
    session.add(table1)
    session.commit()
    session.refresh(table1)

    category1 = Category(
        name="Category 1",
        restaurantid=restaurant1.id,
        orderindex="0|aaaa"
    )

    session.add(category1)
    session.commit()
    session.refresh(category1)

    menuitem = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem)
    session.commit()
    session.refresh(menuitem)


@pytest.fixture
def create_order(session, order_setup):
    order1 = Order(
        tableid=1,
        restaurantid=1,
        comment="none"
    )

    session.add(order1)
    session.commit()
    session.refresh(order1)
    assert order1.id == 1
    orderitem = OrderItem(
        orderid=1,
        menuitemid=1,
        quantity=1,
        orderstatus="pending"
    )
    session.add(orderitem)
    session.commit()
    session.refresh(order1)
    yield order1


@pytest.fixture(name="pwd_context")
def create_hash_function(session):
    yield CryptContext(schemes=["bcrypt"], deprecated="auto")


@pytest.fixture(name="register_manager")
def register_manager_1(client):
    role = "manager"
    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "1@gmail.com",
        "password": "123",
        "role": role,
        "imagepath": "brother"
    })
    assert response.status_code == 200
    return (response.json(), role)


@pytest.fixture(name="manager_1")
def create_manager_1(client, register_manager):
    role = register_manager[1]
    manager = register_manager[0]

    email = manager["email"]
    response1 = client.post("/token", data={
        "username": str(email),
        "password": "123",
        "role": role,
    })
    token = response1.json()
    assert response1.status_code == 200
    yield token, manager


@pytest.fixture(name="auth_register_manager")
def auth_register_manager_1(client_with_auth):
    role = "manager"
    response = client_with_auth.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "1@gmail.com",
        "password": "123",
        "role": role,
        "imagepath": "brother"
    })

    assert response.status_code == 200
    return (response.json(), role)


@pytest.fixture(name="auth_register_all")
def auth_register_all(client_with_auth):
    role = roles.WAITER
    response = client_with_auth.post("/createAccount", json={
        "firstname": "waiter",
        "lastname": "kim",
        "email": "waiter@gmail.com",
        "password": "123",
        "role": role,
        "imagepath": "brother"
    })
    assert response.status_code == 200

    role = roles.CHEF
    response1 = client_with_auth.post("/createAccount", json={
        "firstname": "chef",
        "lastname": "kim",
        "email": "chef@gmail.com",
        "password": "123",
        "role": role,
        "imagepath": "brother"
    })
    assert response1.status_code == 200

    role = roles.WAITER
    response2 = client_with_auth.post("/createAccount", json={
        "firstname": "customer",
        "lastname": "kim",
        "email": "customer@gmail.com",
        "password": "123",
        "role": role,
        "imagepath": "brother"
    })

    assert response2.status_code == 200
    # waitstaff, kitchenstaff, customer
    return (response.json(), response1.json(), response2.json())


@pytest.fixture(name="auth_login_all")
def auth_login_all(client_with_auth, auth_register_all):
    waiter = auth_register_all[0]
    response = client_with_auth.post("/token", data={
        "username": waiter["email"],
        "password": "123",
        "role": Roles.WAITER
    })
    assert response.status_code == 200
    waiter_token = response.json()

    chef = auth_register_all[1]
    response1 = client_with_auth.post("/token", data={
        "username": chef["email"],
        "password": "123",
        "role": Roles.CHEF
    })
    chef_token = response1.json()
    assert response1.status_code == 200

    customer = auth_register_all[2]
    response2 = client_with_auth.post("/token", data={
        "username": customer["email"],
        "password": "123",
        "role": Roles.CUSTOMER
    })
    assert response2.status_code == 200
    customer_token = response2.json()
    return (waiter_token, chef_token, customer_token)


@pytest.fixture(name="auth_register_chef")
def auth_register_chef(client_with_auth):
    role = roles.CHEF
    response = client_with_auth.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "chef@gmail.com",
        "password": "123",
        "role": role
    })

    assert response.status_code == 200
    return (response.json(), role)


@pytest.fixture(name="auth_login_manager")
def auth_login_manager_1(client_with_auth, auth_register_manager):
    role = auth_register_manager[1]
    manager = auth_register_manager[0]
    email = manager["email"]
    response1 = client_with_auth.post("/token", data={
        "username": str(email),
        "password": "123",
        "role": role
    })
    token = response1.json()
    assert response1.status_code == 200
    yield token, manager


@pytest.fixture
def auth_create_restaurant(
    client_with_auth, auth_login_manager
):
    token = auth_login_manager[0]
    access_token = token["access_token"]

    # create restaurant
    response = auth.post(
        client_with_auth, "/manager/restaurant",
        {
            "name": "CC Train",
            "comment": "test",
            "imagepath": "test"
        },
        access_token
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
    # token, restaurant response
    return (auth_login_manager[0], response.json())


@pytest.fixture
def create_multiple_orders(session):
    restaurant1 = Restaurant(
        name="Restaurant 1",
        comment="Hello",
        imagepath="test"
    )
    session.add(restaurant1)
    session.commit()
    session.refresh(restaurant1)

    # create numerous tables

    table1 = RestaurantTable(
        tableid=1,
        restaurantid=restaurant1.id
    )
    session.add(table1)
    session.commit()
    session.refresh(table1)

    table2 = RestaurantTable(
        tableid=2,
        restaurantid=restaurant1.id
    )
    session.add(table2)
    session.commit()
    session.refresh(table2)

    table3 = RestaurantTable(
        tableid=3,
        restaurantid=restaurant1.id
    )
    session.add(table3)
    session.commit()
    session.refresh(table3)

    category1 = Category(
        name="Category 1",
        restaurantid=restaurant1.id,
        orderindex="0|aaaa"
    )

    session.add(category1)
    session.commit()
    session.refresh(category1)

    # create multiple menu items

    menuitem1 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem1)
    session.commit()
    session.refresh(menuitem1)

    menuitem2 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem2)
    session.commit()
    session.refresh(menuitem2)

    menuitem3 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem3)
    session.commit()
    session.refresh(menuitem3)

    menuitem4 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem4)
    session.commit()
    session.refresh(menuitem4)

    menuitem5 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem5)
    session.commit()
    session.refresh(menuitem5)

    menuitem6 = MenuItem(
        title="food",
        description="null",
        cost=12,
        imagepath="/",
        ingredients="meatballs",
        orderindex="0|aaaaa",
        categoryid=category1.id,
        restaurantid=restaurant1.id
    )

    session.add(menuitem6)
    session.commit()
    session.refresh(menuitem6)


@pytest.fixture(name="auth_restaurant")
def auth_create_restaurant_with_manager(
    client_with_auth, auth_login_manager
):
    token = auth_login_manager[0]
    access_token = token["access_token"]

    response = auth.post(
        client_with_auth, "/manager/restaurant",
        {
            "name": "CC Train",
            "comment": "test",
            "imagepath": "test"
        },
        access_token
    )

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
    assert response.status_code == 200
    yield access_token, response.json()
