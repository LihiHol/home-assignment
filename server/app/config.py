from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URI: str | None = None
    MONGODB_HOST: str = "localhost"
    MONGODB_PORT: int = 27017
    MONGODB_USER: str | None = None
    MONGODB_PASSWORD: str | None = None
    MONGODB_DATABASE: str = "ib_test"

    IMAGE_BASE_DIR: Path = Field(default_factory=lambda: Path(r"C:\Users\Omer\Desktop\ib-test\Documents\Images"))

    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
