from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
import models, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Schema request/response ---
class RegisterRequest(BaseModel):
    nama: str
    nim: str | None = None
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    nama: str

# --- Endpoint Register ---
@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Cek email sudah ada atau belum
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    
    new_user = models.User(
        nama=data.nama,
        nim=data.nim,
        email=data.email,
        password_hash=auth.hash_password(data.password),
        role="mahasiswa"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Registrasi berhasil! Silakan login."}

# --- Endpoint Login ---
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not auth.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email atau password salah.")
    
    token = auth.create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "nama": user.nama
    }

# --- Endpoint profil (cek siapa yang sedang login) ---
@router.get("/me")
def get_me(current_user = Depends(auth.get_current_user)):
    return {
        "id": current_user.id,
        "nama": current_user.nama,
        "email": current_user.email,
        "nim": current_user.nim,
        "role": current_user.role
    }