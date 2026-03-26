from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    mongodb_url: str
    db_name: str = "bansal_fireworks"

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    allowed_origins: str = "https://www.bansalfireworks.com,https://bansalfireworks.com"
    app_env: str = "development"

    twilio_account_sid: str
    twilio_auth_token: str
    twilio_from: str = "whatsapp:+14155238886"
    twilio_template_sid: str
    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
