
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import Optional

from app.models.models import Account
from app.db.database import Session, get_db
from app.crud.main import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Account:
    # Исключение для невалидных токенов
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Декодируем токен
    payload = verify_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Извлекаем username из токена
    # "sub" (subject) - стандартное поле JWT для идентификатора пользователя
    username: Optional[str] = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    # Ищем пользователя в базе данных
    user = db.query(Account).filter(Account.username == username).first()
    if user is None:
        raise credentials_exception

    return user