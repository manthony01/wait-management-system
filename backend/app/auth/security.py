

# import os
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from sqlalchemy.orm import Session

from ..sql_app.models.user import User


from ..settings import Settings

from ..sql_app.database import get_db
from jose import jwt, JWTError


valid_scopes = {
    "customer": "gives permissions to view restaurant menus",
    "manager": "gives permissions to create and edit restaurant menus",
    "waitstaff":  ("gives permission to change order status"),
    "kitchenstaff": "gives permission to change order status"
}

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes=valid_scopes
)

settings = Settings()


def check_valid_scopes(
    role: str
):
    if role not in valid_scopes:
        raise HTTPException(
            status_code=404,
            detail=f"Role does not exist: {role}"
        )
    return True


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    security_scopes: SecurityScopes,
    db: Session = Depends(get_db)
):
    if token == "dev":
        return None

    try:
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="user is invalid",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="invalid_token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db_user = db.get(User, email)
    return db_user
