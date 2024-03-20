from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from ..settings import Settings
from os import environ

settings = Settings()

engine = create_engine(
    settings.SQLITE_URL
)

if environ.get("DEV", default=None):
    engine = create_engine(
        settings.POSTGRES_URL
    )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
