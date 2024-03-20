from pydantic import (
    BaseSettings
)


class Settings(BaseSettings):
    POSTGRES_URL: str = (
        "postgresql+psycopg2://"
        "postgres:postgres@postgres:5432/"
        "waitmanagementdb"
    )
    POSTGRES_HOST: str = "postgres"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DBNAME: str = "waitmanagementdb"
    POSTGRES_PORT: str = "5432"
    ACCESS_TOKEN_EXPIRES_MINUTES: int = 60*24
    SECRET_KEY: str = "(09d25e094faa6ca2556c818166b7a9563b93f)"
    "(7099f6f0f4caa6cf63b88e8d3e7)"
    ALGORITHM: str = "HS256"
    SQLITE_URL: str = "sqlite://"

    class Config:
        env_file = '.env', '.env.prod'
        env_file_encoding = 'utf-8'
