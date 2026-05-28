from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, auth

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_my_notifications(db: Session = Depends(get_db),
                         current_mahasiswa = Depends(auth.get_current_mahasiswa)):
    return db.query(models.Notification).filter(
        models.Notification.user_id == current_mahasiswa.id
    ).order_by(models.Notification.created_at.desc()).all()

@router.patch("/{notif_id}/read")
def mark_as_read(notif_id: int, db: Session = Depends(get_db),
                 current_mahasiswa = Depends(auth.get_current_mahasiswa)):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notif_id,
        models.Notification.user_id == current_mahasiswa.id
    ).first()
    if not notif:
        return {"message": "Notifikasi tidak ditemukan."}
    notif.is_read = True
    db.commit()
    return {"message": "Notifikasi ditandai sudah dibaca."}