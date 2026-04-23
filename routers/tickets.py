from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import get_db
import models, auth

router = APIRouter(prefix="/tickets", tags=["Tickets"])

class TicketCreate(BaseModel):
    tipe: str            # 'hilang' | 'temuan'
    nama_barang: str
    deskripsi: Optional[str] = None
    ciri_barang: Optional[str] = None
    lokasi: str
    waktu_kejadian: datetime
    foto_url: Optional[str] = None

class TicketStatusUpdate(BaseModel):
    status: str          # 'menunggu' | 'diproses' | 'dikonfirmasi' | 'selesai'

# Mahasiswa: buat tiket baru
@router.post("/", status_code=201)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db),
                  current_user = Depends(auth.get_current_user)):
    ticket = models.Ticket(**data.dict(), user_id=current_user.id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"message": "Tiket berhasil dikirim!", "ticket_id": ticket.id}

# Mahasiswa: lihat tiket milik sendiri
@router.get("/my")
def get_my_tickets(db: Session = Depends(get_db),
                   current_user = Depends(auth.get_current_user)):
    tickets = db.query(models.Ticket).filter(
        models.Ticket.user_id == current_user.id
    ).order_by(models.Ticket.created_at.desc()).all()
    return tickets

# Admin: lihat semua tiket yang masuk
@router.get("/all")
def get_all_tickets(db: Session = Depends(get_db),
                    _admin = Depends(auth.require_admin)):
    return db.query(models.Ticket).order_by(models.Ticket.created_at.desc()).all()

# Admin: update status tiket + kirim notifikasi otomatis
@router.patch("/{ticket_id}/status")
def update_ticket_status(ticket_id: int, data: TicketStatusUpdate,
                         db: Session = Depends(get_db),
                         _admin = Depends(auth.require_admin)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan.")
    
    ticket.status = data.status
    db.commit()

    # Otomatis kirim notifikasi ke mahasiswa pemilik tiket
    pesan_status = {
        "diproses": "Tiket Anda sedang diproses oleh admin.",
        "dikonfirmasi": "Barang Anda telah dikonfirmasi! Silakan hubungi admin.",
        "selesai": "Tiket Anda telah diselesaikan. Terima kasih!"
    }
    if data.status in pesan_status:
        notif = models.Notification(
            user_id=ticket.user_id,
            judul=f"Update status: {ticket.nama_barang}",
            pesan=pesan_status[data.status]
        )
        db.add(notif)
        db.commit()

    return {"message": f"Status tiket diperbarui menjadi '{data.status}'."}