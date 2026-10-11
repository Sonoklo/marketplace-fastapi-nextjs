from passlib.context import CryptContext

crypt = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return crypt.hash(password)

def verify_password(password: str, hash_password: str) -> bool:
    return crypt.verify(password, hash_password)

def create_access_token():
    ...
