from fastapi import FastAPI
from backend.app.db.database import init_db
from backend.app.api.routes import main
from backend.app.core.config import settings

app = FastAPI(
    docs_url=settings.DOCS_URL,
    openapi_url=settings.OPENAPI_URL
    )

app.include_router(main.router_register)
app.include_router(main.router_login)