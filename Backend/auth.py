from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models, os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

import bcrypt as _bcrypt
if not hasattr(_bcrypt, '__about__'):
    _bcrypt.__about__ = type('about', (), {'__version__': _bcrypt.__version__})()

SECRET_KEY = os.getenv("SECRET_KEY", "ganti-dengan-kunci-rahasia-yang-panjang")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_mahasiswa(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token tidak valid. Silakan login kembali.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        mahasiswa_id: int = payload.get("sub")
        if mahasiswa_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    mahasiswa = db.query(models.Mahasiswa).filter(models.Mahasiswa.id == mahasiswa_id).first()
    if mahasiswa is None:
        raise credentials_exception
    return mahasiswa

def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Admin tidak valid"
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("sub")

        if admin_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()

    if admin is None:
        raise credentials_exception

    return admin

def require_admin(current_admin = Depends(get_current_admin)):
    return current_admin

_raw_key = os.getenv("AES_SECRET_KEY", "")

if _raw_key:
    # Jika disimpan sebagai hex string (64 karakter)
    try:
        AES_KEY = bytes.fromhex(_raw_key)
        if len(AES_KEY) != 32:
            raise ValueError
    except (ValueError, AttributeError):
        AES_KEY = _raw_key.encode()[:32].ljust(32, b"\x00")
else:
    # Fallback dev-only — JANGAN dipakai di production
    import warnings
    warnings.warn(
        "AES_SECRET_KEY tidak ditemukan di environment! "
        "Menggunakan kunci sementara — TIDAK AMAN untuk production.",
        RuntimeWarning,
        stacklevel=2,
    )
    AES_KEY = os.urandom(32)          # ephemeral, data tidak bisa di-decrypt restart


# ── Core Functions ────────────────────────────────────────────────────────────

def encrypt(plaintext: str) -> str:
    """
    Enkripsi string menggunakan AES-256-GCM.

    Format output (base64 URL-safe, disimpan sebagai satu string di DB):
        <nonce_12_bytes>:<ciphertext_with_16byte_tag>
    Authentication Tag 128-bit disertakan otomatis oleh AESGCM.

    Returns:
        str : "<nonce_b64>:<ciphertext_b64>"
    """
    if not plaintext:
        return plaintext

    aesgcm = AESGCM(AES_KEY)
    nonce = os.urandom(12)                          # 96-bit IV, unik per record
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)
    # AESGCM.encrypt() sudah menyertakan authentication tag 128-bit di akhir ciphertext

    nonce_b64 = base64.urlsafe_b64encode(nonce).decode()
    ct_b64 = base64.urlsafe_b64encode(ciphertext).decode()
    return f"{nonce_b64}:{ct_b64}"


def decrypt(token: str) -> str:
    """
    Dekripsi token yang dihasilkan oleh encrypt().
    Jika authentication tag tidak valid (data dimanipulasi), cryptography
    akan melempar InvalidTag — request harus ditolak.

    Returns:
        str : plaintext asli
    Raises:
        ValueError     : format token salah
        cryptography.exceptions.InvalidTag : integritas data rusak (tampering)
    """
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
        raise ValueError(f"Dekripsi gagal: {exc}") from exc


def is_encrypted(value: str) -> bool:
    """Cek apakah value sudah dalam format terenkripsi."""
    if not value:
        return False
    parts = value.split(":", 1)
    if len(parts) != 2:
        return False
    try:
        base64.urlsafe_b64decode(parts[0])
        return True
    except Exception:
        return False


# ── Helper: encrypt only if not yet encrypted ─────────────────────────────────

def safe_encrypt(value: str | None) -> str | None:
    """Enkripsi value jika belum terenkripsi. None tetap None."""
    if value is None:
        return None
    if is_encrypted(value):
        return value
    return encrypt(value)


def safe_decrypt(value: str | None) -> str | None:
    """Dekripsi value jika dalam format terenkripsi. None tetap None."""
    if value is None:
        return None
    if is_encrypted(value):
        return decrypt(value)
    return value          # plaintext legacy data