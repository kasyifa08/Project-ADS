from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import get_db
import models
import auth
from auth import safe_encrypt, safe_decrypt, log_activity

router = APIRouter(prefix="/posts", tags=["Posts"])

class PostCreate(BaseModel):
    judul: str
    deskripsi: str
    lokasi_ditemukan: Optional[str] = None
    waktu_ditemukan: Optional[datetime] = None
    foto_url: Optional[str] = None
    tipe: Optional[str] = "temuan"
    status: Optional[str] = "tersedia"
    kategori: Optional[str] = None
    warna: Optional[str] = None
    ciri_barang: Optional[str] = None


# ==========================================
# Admin: Buat postingan barang temuan
# ==========================================
@router.post("/", status_code=201)
def create_post(
    data: PostCreate,
    request: Request,  # Menambahkan request untuk menangkap IP
    db: Session = Depends(get_db),
    current_admin = Depends(auth.require_admin)
):
    # Enkripsi ciri_barang untuk melindungi privasi data spesifik barang
    post_data = data.dict()
    if post_data.get("ciri_barang"):
        post_data["ciri_barang"] = safe_encrypt(post_data["ciri_barang"])

    post = models.Post(
        **post_data,
        admin_id=current_admin.id
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    # Catat Log: Pembuatan Post Baru oleh Admin
    log_activity(
        db=db,
        user_id=current_admin.id,
        user_role="admin",
        action="CREATE_POST",
        resource="posts",
        resource_id=post.id,
        ip_address=request.client.host,
        detail=f"Admin membuat postingan baru dengan judul: '{data.judul}'"
    )

    return {
        "message": "Post berhasil dibuat!",
        "post_id": post.id
    }


# ==========================================
# Semua user: Lihat semua postingan barang temuan
# ==========================================
@router.get("/")
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).all()
    
    # Dekripsi data terenkripsi (seperti ciri_barang) sebelum dikirim ke client
    for post in posts:
        if hasattr(post, "ciri_barang") and post.ciri_barang:
            post.ciri_barang = safe_decrypt(post.ciri_barang)
            
    return posts


# ==========================================
# Semua user: Lihat detail satu post
# ==========================================
@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post tidak ditemukan.")
    
    # Dekripsi ciri_barang agar terbaca normal di frontend
    if hasattr(post, "ciri_barang") and post.ciri_barang:
        post.ciri_barang = safe_decrypt(post.ciri_barang)
        
    return post


# ==========================================
# Admin: Update status post
# ==========================================
@router.patch("/{post_id}/status")
def update_post_status(
    post_id: int, 
    status: str, 
    request: Request,  # Menambahkan request untuk menangkap IP
    db: Session = Depends(get_db),
    current_admin = Depends(auth.require_admin) # Menggunakan nama variable 'current_admin' agar konsisten
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post tidak ditemukan.")
    
    old_status = post.status
    post.status = status
    db.commit()

    # Catat Log: Perubahan Status Barang (Misal: dari 'tersedia' menjadi 'diklaim')
    log_activity(
        db=db,
        user_id=current_admin.id,
        user_role="admin",
        action="UPDATE_STATUS_POST",
        resource="posts",
        resource_id=post.id,
        ip_address=request.client.host,
        detail=f"Admin mengubah status post ID {post.id} dari '{old_status}' menjadi '{status}'"
    )

    return {"message": f"Status post diperbarui menjadi '{status}'."}