from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import get_db
import models, auth

router = APIRouter(prefix="/posts", tags=["Posts"])

class PostCreate(BaseModel):
    judul: str
    deskripsi: str
    lokasi_ditemukan: Optional[str] = None
    waktu_ditemukan: Optional[datetime] = None
    foto_url: Optional[str] = None

# Admin: buat postingan barang temuan
@router.post("/", status_code=201)
def create_post(
    data: PostCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    post = models.Post(
        **data.dict(),
        admin_id=current_user.id
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "message": "Post berhasil dibuat!",
        "post_id": post.id
    }

# Semua user: lihat semua postingan barang temuan
@router.get("/")
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()

# Semua user: lihat detail satu post
@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post tidak ditemukan.")
    return post

# Admin: update status post
@router.patch("/{post_id}/status")
def update_post_status(post_id: int, status: str, db: Session = Depends(get_db),
                       _admin = Depends(auth.require_admin)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post tidak ditemukan.")
    post.status = status
    db.commit()
    return {"message": f"Status post diperbarui menjadi '{status}'."}