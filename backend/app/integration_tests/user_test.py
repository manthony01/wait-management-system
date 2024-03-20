from .helper import Roles, decode_token

roles = Roles()


def login(email, password):
    return {
        "username": email,
        "password": password,
    }


def test_register_user(client):
    password = "123"

    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "password": password,
        "imagepath": "brother"
    })

    assert response.status_code == 200
    json = response.json()
    assert json == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "imagepath": "brother",
    }


def test_register_already_existing_user(client, register_manager):
    manager = register_manager[0]
    response = client.post("/createAccount", json={
        "firstname": manager["firstname"],
        "lastname": manager["lastname"],
        "email": manager["email"],
        "password": "123",
        "imagepath": "brother"
    })

    assert response.status_code == 403
    assert response.json() == {
        'detail': 'Email already exists: 1@gmail.com'
    }


def test_user_login(client):
    # register manager account
    password = "123"
    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "1@gmail.com",
        "password": password,
        "imagepath": "brother"
    })
    assert response.status_code == 200
    user = response.json()
    assert user == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "1@gmail.com",
        "imagepath": "brother",
    }

    # login as manager
    # email = user["email"]

    # login_data = login(email, password, role)
    # response1 = client.post("/token", data=login_data)
    # assert response1.status_code == 200

    # confirm login works
    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    body = decode_token(token_data["access_token"])
    assert "exp" in body
    del body["exp"]
    assert body == {
        "sub": user["email"],
    }


def test_user_login_invalid_email(client, manager_1):
    # user login with invalid email
    wrong_email = "blahblahblah"
    login_data = login(wrong_email, "123")
    response = client.post("/token", data=login_data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid username/password",
    }


def test_user_login_invalid_password(client, manager_1):
    manager_data = manager_1[1]
    data = login(manager_data["email"], "1234")
    response = client.post("/token", data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid username/password",
    }


def test_register_customer(client):
    password = "123"
    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "password": password,
        "imagepath": "brother"
    })

    assert response.status_code == 200
    user = response.json()
    assert user == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "imagepath": "brother",
    }

    # confirm login works
    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    body = decode_token(token_data["access_token"])
    assert "exp" in body
    del body["exp"]
    assert body == {
        "sub": user["email"],
    }


def test_register_wait_staff(client):
    password = "123"
    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "password": password,
        "imagepath": "brother",
    })

    assert response.status_code == 200
    user = response.json()
    assert user == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "imagepath": "brother",
    }

    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    # confirm login works
    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    body = decode_token(token_data["access_token"])
    assert "exp" in body
    del body["exp"]
    assert body == {
        "sub": user["email"],
    }


def test_register_kitchen_staff(client):
    password = "123"

    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "password": password,
        "imagepath": "brother"
    })

    assert response.status_code == 200
    user = response.json()
    assert user == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "imagepath": "brother",
    }

    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    # confirm login works
    login_data = login(user["email"], password)
    response = client.post("/token", data=login_data)
    assert response.status_code == 200

    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    body = decode_token(token_data["access_token"])
    assert "exp" in body
    del body["exp"]
    assert body == {
        "sub": user["email"],
    }


def test_get_user(client):
    password = "123"
    email = "anthony.kim2114@gmail.com"
    response = client.post("/createAccount", json={
        "firstname": "anthony",
        "lastname": "kim",
        "email": email,
        "password": password,
        "imagepath": "brother"
    })

    assert response.status_code == 200
    user = response.json()
    assert user == {
        "firstname": "anthony",
        "lastname": "kim",
        "email": "anthony.kim2114@gmail.com",
        "imagepath": "brother",
    }

    response1 = client.get(f"/user/{email}")
    assert response1.status_code == 200
    assert response1.json() == {
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "email": email,
        "imagepath": user["imagepath"]
    }
