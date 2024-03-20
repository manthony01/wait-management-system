from typing import Annotated, List, Optional, Union
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .sql_app.schemas.tag import Tag


from .sql_app.crud import account
from .sql_app.schemas.user import (
    TokenWithUser, User, UserCreate, UserResponse
)
from .settings import Settings
from .sql_app.schemas.restaurant import (
    Category, LoyaltyProgram, MenuItem, MenuItemRead, MenuWithTags, Restaurant,
    RestaurantTable
)
from .sql_app.database import engine, Base, get_db
from minio import Minio
from uuid import uuid4
from .routers import read, managers, customers, staff
import json
import os

Base.metadata.create_all(bind=engine)
settings = Settings()
origins = [
    "http://localhost:3000",
    "frontend"
]


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(managers.router)
app.include_router(customers.router)
app.include_router(staff.router)

minio_client = None
if os.environ.get("DEV"):
    minio_client = Minio(
        endpoint="minio:9000",
        access_key="minio",
        secret_key="miniominio",
        secure=False
    )

    bucket_found = minio_client.bucket_exists("waitmanagement")
    if not bucket_found:
        minio_client.make_bucket("waitmanagement")
    else:
        print("Bucket 'waitmanagement' already exists")

    minio_client.set_bucket_policy("waitmanagement", json.dumps({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": ["s3:GetObject"],
                "Resource": "arn:aws:s3:::*"
            }
        ]
    }))


async def get_current_user_override():
    pass


# COMMENT OUT TO ENABLE AUTH

# if os.environ.get("DEV"):
#     app.dependency_overrides[security.get_current_user] = (
#         get_current_user_override
#     )


@app.get("/health")
def health_check():
    return {"message": "I'm alive"}


@app.get("/presignedPutUrl")
def get_presigned_put_url():
    id = str(uuid4())
    return {"url": minio_client.presigned_put_object("waitmanagement", id),
            "key": id}


@app.get("/presignedGetUrl")
def get_presigned_get_url(
    key: str,
):
    return minio_client.presigned_get_object("waitmanagement", key)


"""
Restaurant getters
"""


@app.get("/restaurant/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    return read.get_restaurant(db, restaurant_id)


@app.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants(
    db: Session = Depends(get_db)
):
    return read.get_all_restaurants(db)


@app.get(
    "/restaurant/{restaurant_id}/menu",
    response_model=List[MenuWithTags]
)
async def get_restaurant_menu(
    restaurant_id: int,
    tags: Annotated[Union[List[int], None], Query()] = None,
    db: Session = Depends(get_db)
):
    if not tags:
        return read.get_restaurant_menu(db, restaurant_id)
    return read.get_restaurant_menu_by_tags(db, restaurant_id, tags)


@app.get(
    "/restaurant/{restaurant_id}/loyalty",
    response_model=LoyaltyProgram
)
async def get_restaurant_loyalty_program(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    return read.get_loyalty_program(db, restaurant_id)


@app.get("/menuItem/{menu_item_id}", response_model=MenuItemRead)
async def get_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db)
):
    return read.get_menu_item(db, menu_item_id)


@app.get("/category/{category_id}", response_model=Category)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    return read.get_category(db, category_id)


@app.get(
    "/restaurant/{restaurant_id}/table/{table_id}",
    response_model=RestaurantTable
)
async def get_restaurant_table(
    restaurant_id: int,
    table_id: int,
    db: Session = Depends(get_db)
):
    return read.get_restaurant_table(db, restaurant_id, table_id)


@app.get(
    "/restaurant/{restaurant_id}/tables",
    response_model=List[RestaurantTable]
)
async def get_restaurant_tables(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    return read.get_restaurant_tables(db, restaurant_id)


@app.get(
    "/menuItems",
    response_model=List[MenuItem]
)
async def get_menu_items(
    menuid: Optional[List[int]] = Query(None),
    db: Session = Depends(get_db)
):
    return read.get_menu_items(db, menuid)


@app.get(
    "/user/{email}",
    response_model=UserResponse
)
async def get_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    return read.get_user(db, email)


"""
Authentication
"""


@app.post(
    "/createAccount", response_model=User,
)
async def create_account(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # security.check_valid_scopes(user.role)
    return account.register_user(db, user)


@app.post(
    "/token", response_model=TokenWithUser
)
async def user_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    # security.check_valid_scopes(role)
    email = form_data.username
    password = form_data.password
    return account.login(db, email, password)


"""
Tags
"""


@app.get(
    "/tags", response_model=List[Tag]
)
async def get_all_tags(
    tags: Annotated[Union[List[int], None], Query()] = None,
    db: Session = Depends(get_db)
):
    if not tags:
        return read.get_all_tags(db)
    return read.get_all_given_tags(db, tags)
