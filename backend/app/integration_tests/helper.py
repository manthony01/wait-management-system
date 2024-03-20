from jose import JWTError, jwt

from ..settings import Settings


def get_bearer_header(access_token):
    return {"Authorization": f"Bearer {access_token}"}


def decode_token(access_token):
    settings = Settings()
    try:
        decoded = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        raise Exception("jwt error, maybe invalid token")
    return decoded


class auth_http_requests:
    def __init__(self):
        pass

    def post(self, client, url, body, access_token):
        return client.post(
            url, json=body, headers=get_bearer_header(access_token)
        )

    def get(self, client, url, access_token):
        return client.get(url, headers=get_bearer_header(access_token))

    def delete(self, client, url, access_token):
        return client.delete(url, headers=get_bearer_header(access_token))

    def patch(self, client, url, body, access_token):
        return client.patch(url, json=body,
                            headers=get_bearer_header(access_token))

    def get_protected(self, client, url, data, access_token):
        response = self.get(
            client,
            url,
            access_token
        )
        assert response.status_code == 401
        assert response.json() == {
            'detail': 'Not enough permissions'
        }

    def post_protected(self, client, url, data, access_token):
        response = self.post(
            client,
            url,
            data,
            access_token
        )
        assert response.status_code == 401
        assert response.json() == {
            'detail': 'Not enough permissions'
        }

    def delete_protected(self, client, url, access_token):
        response = self.delete(
            client,
            url,
            access_token
        )
        assert response.status_code == 401
        assert response.json() == {
            'detail': 'Not enough permissions'
        }

    def patch_protected(self, client, url, data, access_token):
        response = self.patch(
            client,
            url,
            data,
            access_token
        )
        assert response.status_code == 401
        assert response.json() == {
            'detail': 'Not enough permissions'
        }

    def login(self, client, username, password, role):
        return client.post(
            "/token",
            data={
                "email": username,
                "password": password,
                "role": role
            }
        )


class Roles:
    MANAGER = "manager"
    CUSTOMER = "customer"
    WAITER = "waitstaff"
    CHEF = "kitchenstaff"
    roles = []

    def __init__(self):

        self.roles.append(self.MANAGER)
        self.roles.append(self.CUSTOMER)
        self.roles.append(self.WAITER)
        self.roles.append(self.CHEF)

    def valid_role(self, rolename):
        return rolename in self.roles
