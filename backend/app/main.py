from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import main
from app.core.config import settings

app = FastAPI(
    docs_url=settings.DOCS_URL,
    openapi_url=settings.OPENAPI_URL
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main.router_register)
app.include_router(main.router_login)