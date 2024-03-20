# from fastapi import HTTPException
from datetime import timedelta, datetime
from fastapi import HTTPException
from typing import Union
from sqlalchemy.orm import Session

from app.integration_tests.helper import Roles

from ..models.staff import Staff
from ..models.user import User
from ...settings import Settings
from ..schemas.user import UserCreate

from passlib.context import CryptContext
from jose import JWTError, jwt

settings = Settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def decode_token(access_token):
    settings = Settings()
    try:
        decoded = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        raise Exception("jwt error, maybe invalid token")
    return (decoded["sub"], decoded["scope "])


def add_staff(db: Session, email: str, role: str):
    staff_roles = ["manager", "kitchenstaff", "waitstaff"]
    if (role in staff_roles):
        db_staff = Staff(
            email=email,
            rolename=role
        )
        db.add(db_staff)
        db.commit()
        db.refresh(db_staff)
        return True
    return False


def register_user(db: Session, user: UserCreate):
    # check if user is unique
    existing_user = db.get(User, user.email)
    if existing_user:
        raise HTTPException(
            status_code=403,
            detail=f"Email already exists: {user.email}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db_user = User(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        hashedpassword=get_password_hash(user.password),
        imagepath=user.imagepath
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    add_staff(db, user.email, Roles.MANAGER)
    add_staff(db, user.email, Roles.WAITER)
    add_staff(db, user.email, Roles.CHEF)
    return db_user


def authenticate_staff(db: Session, email: str, role: str):
    staff = db.get(Staff, (email, role))
    if not staff:
        raise HTTPException(
            status_code=403,
            detail=f"User does not have {role} account",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return staff


def authenticate_user(db: Session, email: str, password: str):
    user = db.get(User, email)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username/password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(password, user.hashedpassword):
        raise HTTPException(
            status_code=401,
            detail="Invalid username/password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def create_access_token(data: dict,
                        expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY,
                             algorithm=settings.ALGORITHM)
    return encoded_jwt


def login(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=access_token_expires
    )
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer",
    }
