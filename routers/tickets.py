from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import get_db
from auth import require_admin
from models import Notification
import models, auth

router = APIRouter(prefix="/tickets", tags=["Tickets"])

class TicketCreate(BaseModel):
    tipe: str            # 'hilang' | 'temuan'
    nama_barang: str
    deskripsi: Optional[str] = None
    kategori: Optional[str] = None
    ciri_barang: Optional[str] = None
    lokasi: str
    waktu_kejadian: datetime
    foto_url: Optional[str] = None

class TicketStatusUpdate(BaseModel):
    status: str
    # menunggu | diproses | selesai | ditolak

# Mahasiswa: buat tiket baru
@router.post("/", status_code=201)
def create_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    current_mahasiswa = Depends(auth.get_current_mahasiswa)
):
    ticket = models.Ticket(
        **data.dict(),
        user_id=current_mahasiswa.id,
        status="menunggu"
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "message": "Tiket berhasil dikirim dan menunggu verifikasi admin.",
        "ticket_id": ticket.id,
        "status": ticket.status
    }

# Mahasiswa: lihat tiket milik sendiri
@router.get("/my/")
def get_my_tickets(db: Session = Depends(get_db),
                   current_mahasiswa = Depends(auth.get_current_mahasiswa)):
    tickets = db.query(models.Ticket).filter(
        models.Ticket.user_id == current_mahasiswa.id
    ).order_by(models.Ticket.created_at.desc()).all()
    return tickets

# Admin: lihat semua tiket yang masuk
@router.get("/all")
def get_all_tickets(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    return db.query(models.Ticket).all()

# Admin: update status tiket + kirim notifikasi otomatis
@router.patch("/{ticket_id}/status")
def update_ticket_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(auth.require_admin)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Tiket tidak ditemukan."
        )

    # update status tiket
    ticket.status = data.status

    # otomatis buat postingan saat diterima admin
    if data.status in ["diproses", "dikonfirmasi"]:

        existing_post = db.query(models.Post).filter(
            models.Post.ticket_id == ticket.id
        ).first()

        if not existing_post:
            post = models.Post(
                ticket_id=ticket.id,
                admin_id=1,  # nanti bisa diganti admin login
                judul=ticket.nama_barang,
                deskripsi=ticket.deskripsi or "",
                lokasi_ditemukan=ticket.lokasi,
                waktu_ditemukan=ticket.waktu_kejadian,
                foto_url=ticket.foto_url,
                status="tersedia"
            )

            db.add(post)

    # buat pesan notifikasi
    if data.status == "dikonfirmasi":
        pesan = "Laporan Anda telah diterima dan dikonfirmasi admin."
    elif data.status == "ditolak":
        pesan = "Laporan Anda ditolak oleh admin."
    elif data.status == "selesai":
        pesan = "Laporan Anda telah selesai."
    elif data.status == "diproses":
        pesan = "Laporan Anda sedang diproses admin."
    else:
        pesan = f"Status laporan berubah menjadi {data.status}"

    # simpan notifikasi
    notif = models.Notification(
        user_id=ticket.user_id,
        ticket_id=ticket.id,
        judul="Update Laporan",
        pesan=pesan,
        is_read=False
    )

    db.add(notif)

    db.commit()
    db.refresh(ticket)

    return {
        "message": f"Status tiket diperbarui menjadi '{data.status}'."
    }