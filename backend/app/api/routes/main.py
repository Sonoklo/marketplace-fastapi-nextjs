from fastapi import APIRouter, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
import backend.app.crud.main as crud
from backend.app.schemas.schemas import *
from backend.app.models.models import Account
from backend.app.core.dependencies import get_current_user

router_register = APIRouter(prefix="/register",tags=["Account","Auth"])
router_login = APIRouter(prefix="/login",tags=["Account","Auth"])