import base64
import os
import warnings
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from sqlalchemy.orm import Session

# Fix kompatibilitas passlib + bcrypt terbaru (Harus di paling atas)
import bcrypt as _bcrypt
if not hasattr(_bcrypt, '__about__'):
    _bcrypt.__about__ = type('about', (), {'__version__': _bcrypt.__version__})()

import models
from database import get_db

# ── Konfigurasi Environment ──────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY tidak ditemukan di environment variable")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ── Konfigurasi Kunci AES ────────────────────────────────────────────────────
_raw_key = os.getenv("AES_SECRET_KEY", "")

if _raw_key:
    try:
        AES_KEY = bytes.fromhex(_raw_key)
        if len(AES_KEY) != 32:
            raise ValueError
    except (ValueError, AttributeError):
        # Fallback jika key berupa string biasa, potong/sesuaikan ke 32 byte
        AES_KEY = _raw_key.encode("utf-8")[:32].ljust(32, b"\x00")
else:
    warnings.warn(
        "AES_SECRET_KEY tidak ditemukan di environment! "
        "Menggunakan kunci sementara — TIDAK AMAN untuk production.",
        RuntimeWarning,
        stacklevel=2,
    )
    AES_KEY = os.urandom(32)


# ── Modul Autentikasi & Token ────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    # Menggunakan timezone-aware datetime (Python 3.12+ compliant)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_by_model(db: Session, token: str, model):
    """Helper fungsi generik untuk validasi JWT dan query user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token tidak valid atau kedaluwarsa. Silakan login kembali.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(model).filter(model.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_mahasiswa(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user_by_model(db, token, models.Mahasiswa)


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user_by_model(db, token, models.Admin)


def require_admin(current_admin=Depends(get_current_admin)):
    return current_admin


# ── Modul Enkripsi & Dekripsi (AES-256-GCM) ──────────────────────────────────

def encrypt(plaintext: str) -> str:
    if not plaintext:
        return plaintext

    aesgcm = AESGCM(AES_KEY)
    nonce = os.urandom(12)  # 96-bit IV wajib unik
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)

    nonce_b64 = base64.urlsafe_b64encode(nonce).decode("utf-8")
    ct_b64 = base64.urlsafe_b64encode(ciphertext).decode("utf-8")
    return f"{nonce_b64}:{ct_b64}"


def decrypt(token: str) -> str:
    if not token or ":" not in token:
        return token

    try:
        nonce_b64, ct_b64 = token.split(":", 1)
        nonce = base64.urlsafe_b64decode(nonce_b64)
        ciphertext = base64.urlsafe_b64decode(ct_b64)

        aesgcm = AESGCM(AES_KEY)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext.decode("utf-8")
    except Exception as exc:
        raise ValueError(f"Dekripsi gagal atau data telah dimanipulasi: {exc}") from exc


def is_encrypted(value: str) -> bool:
    """Mengecek apakah format string valid sebagai data terenkripsi AES-GCM kita"""
    if not value or ":" not in value:
        return False
    parts = value.split(":", 1)
    if len(parts) != 2:
        return False
    try:
        nonce = base64.urlsafe_b64decode(parts[0])
        # Pengecekan ketat: Nonce GCM standar harus persis 12 byte
        return len(nonce) == 12
    except Exception:
        return False


def safe_encrypt(value: str | None) -> str | None:
    if value is None:
        return None
    return value if is_encrypted(value) else encrypt(value)


def safe_decrypt(value: str | None) -> str | None:
    if value is None:
        return None
    if is_encrypted(value):
        try:
            return decrypt(value)
        except ValueError:
            return value  # Fallback jika ternyata data warisan/bukan enkripsi asli
    return value


# ── Modul Audit Trail ────────────────────────────────────────────────────────

def log_activity(
    db: Session,
    user_id: int,
    user_role: str,
    action: str,
    resource: str = None,
    resource_id: int = None,
    ip_address: str = None,
    detail: str = None,
) -> None:
    entry = models.AuditLog(
        user_id=user_id,
        user_role=user_role,
        action=action,
        resource=resource,
        resource_id=resource_id,
        ip_address=ip_address,
        detail=detail,
    )
    db.add(entry)
    db.commit()


def get_audit_trail(
    db: Session,
    user_id: int = None,
    action: str = None,
    limit: int = 100,
):
    query = db.query(models.AuditLog)
    if user_id:
        query = query.filter(models.AuditLog.user_id == user_id)
    if action:
        query = query.filter(models.AuditLog.action == action)
    return query.order_by(models.AuditLog.created_at.desc()).limit(limit).all()