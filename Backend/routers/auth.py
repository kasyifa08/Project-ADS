from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordRequestForm
from schemas import MahasiswaLogin, AdminLogin, AdminRegisterRequest
from auth import get_current_mahasiswa, verify_password, create_access_token, safe_encrypt, safe_decrypt, log_activity
from database import get_db
import models
import auth

# Menghapus duplikasi deklarasi router sebelumnya
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# =========================
# SCHEMA
# =========================

class RegisterRequest(BaseModel):
    nama: str
    nim: str
    no_telp: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    nama: str


# =========================
# REGISTER MAHASISWA
# =========================

@router.post("/register", status_code=201)
def register(
    data: RegisterRequest,
    request: Request,  # Menambahkan request untuk mengambil IP Address
    db: Session = Depends(get_db)
):
    existing = db.query(models.Mahasiswa).filter(
        models.Mahasiswa.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar."
        )

    new_mahasiswa = models.Mahasiswa(
        nama=safe_encrypt(data.nama),
        nim=data.nim,
        no_telp=safe_encrypt(data.no_telp),
        email=data.email,
        password_hash=auth.hash_password(data.password)
    )

    db.add(new_mahasiswa)
    db.commit()
    db.refresh(new_mahasiswa)

    # Catat Log: Registrasi Mahasiswa (User ID menggunakan id baru yang terbuat)
    log_activity(
        db=db,
        user_id=new_mahasiswa.id,
        user_role="mahasiswa",
        action="REGISTER",
        resource="mahasiswa",
        resource_id=new_mahasiswa.id,
        ip_address=request.client.host,
        detail=f"Registrasi akun mahasiswa berhasil dengan email: {data.email}"
    )

    return {
        "message": "Registrasi mahasiswa berhasil!"
    }

# =========================
# REGISTER ADMIN
# =========================

@router.post("/admin/register", status_code=201)
def register_admin(
    data: AdminRegisterRequest,
    request: Request,  # Menambahkan request untuk mengambil IP Address
    db: Session = Depends(get_db)
):
    existing = db.query(models.Admin).filter(
        models.Admin.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email admin sudah terdaftar."
        )

    new_admin = models.Admin(
        nama=data.nama,
        email=data.email,
        password_hash=auth.hash_password(data.password)
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    # Catat Log: Registrasi Admin
    log_activity(
        db=db,
        user_id=new_admin.id,
        user_role="admin",
        action="REGISTER",
        resource="admin",
        resource_id=new_admin.id,
        ip_address=request.client.host,
        detail=f"Registrasi akun admin berhasil dengan email: {data.email}"
    )

    return {
        "message": "Registrasi admin berhasil!"
    }

# =========================
# LOGIN ADMIN
# =========================

@router.post("/admin/login")
def admin_login(
    request: Request,  # Menambahkan request untuk mengambil IP Address
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    admin = db.query(models.Admin).filter(
        models.Admin.email == form_data.username
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Email admin salah"
        )

    if not verify_password(
        form_data.password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Password admin salah"
        )

    access_token = create_access_token(
        data={
            "sub": str(admin.id),
            "role": "admin"
        }
    )

    # Catat Log: Login Admin
    log_activity(
        db=db,
        user_id=admin.id,
        user_role="admin",
        action="LOGIN",
        resource="admin",
        resource_id=admin.id,
        ip_address=request.client.host,
        detail=f"Admin berhasil masuk sistem"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin",
        "user": {
            "id": admin.id,
            "nama": admin.nama,
            "email": admin.email
        }
    }

# =========================
# LOGIN MAHASISWA
# =========================

@router.post("/login")
def login(
    request: Request,  # Menambahkan request untuk mengambil IP Address
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    mahasiswa = db.query(models.Mahasiswa).filter(
        models.Mahasiswa.email == form_data.username
    ).first()

    if not mahasiswa:
        raise HTTPException(
            status_code=401,
            detail="Email salah"
        )

    if not verify_password(
        form_data.password,
        mahasiswa.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Password salah"
        )

    access_token = create_access_token(
        data={
            "sub": str(mahasiswa.id),
            "role": "mahasiswa"
        }
    )

    # Catat Log: Login Mahasiswa
    log_activity(
        db=db,
        user_id=mahasiswa.id,
        user_role="mahasiswa",
        action="LOGIN",
        resource="mahasiswa",
        resource_id=mahasiswa.id,
        ip_address=request.client.host,
        detail=f"Mahasiswa berhasil masuk sistem"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "mahasiswa",
        "user": {
            "id": mahasiswa.id,
            "nama": mahasiswa.nama,
            "nim": mahasiswa.nim,
            "email": mahasiswa.email
        }
    }


# =========================
# GET CURRENT USER
# =========================

@router.get("/me")
def get_me(
    current_mahasiswa = Depends(get_current_mahasiswa)
):
    # Catatan Tambahan: Data nama dan no_telp terenkripsi AES di database. 
    # Kita gunakan safe_decrypt agar response yang diterima client dalam bentuk plaintext asli.
    return {
        "id": current_mahasiswa.id,
        "nama": safe_decrypt(current_mahasiswa.nama),
        "no_telp": safe_decrypt(current_mahasiswa.no_telp),
        "email": current_mahasiswa.email,
        "nim": current_mahasiswa.nim
    }