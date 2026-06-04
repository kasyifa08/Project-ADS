from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database import get_db
from auth import require_admin, safe_encrypt, safe_decrypt, log_activity
import models
import auth

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


# ==========================================
# Mahasiswa: Buat tiket baru
# ==========================================
@router.post("/", status_code=201)
def create_ticket(
    data: TicketCreate,
    request: Request,  # Menambahkan request untuk log IP
    db: Session = Depends(get_db),
    current_mahasiswa = Depends(auth.get_current_mahasiswa)
):
    ticket_data = data.dict()
    # Enkripsi ciri_barang milik mahasiswa untuk privasi keamanan data
    if ticket_data.get("ciri_barang"):
        ticket_data["ciri_barang"] = safe_encrypt(ticket_data["ciri_barang"])

    ticket = models.Ticket(
        **ticket_data,
        user_id=current_mahasiswa.id,
        status="menunggu"
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    # Catat Log: Pembuatan Tiket oleh Mahasiswa
    log_activity(
        db=db,
        user_id=current_mahasiswa.id,
        user_role="mahasiswa",
        action="CREATE_TICKET",
        resource="tickets",
        resource_id=ticket.id,
        ip_address=request.client.host,
        detail=f"Mahasiswa membuat tiket baru untuk barang: '{data.nama_barang}'"
    )

    return {
        "message": "Tiket berhasil dikirim dan menunggu verifikasi admin.",
        "ticket_id": ticket.id,
        "status": ticket.status
    }


# ==========================================
# Mahasiswa: Lihat tiket milik sendiri
# ==========================================
@router.get("/my/")
def get_my_tickets(
    db: Session = Depends(get_db),
    current_mahasiswa = Depends(auth.get_current_mahasiswa)
):
    tickets = db.query(models.Ticket).filter(
        models.Ticket.user_id == current_mahasiswa.id
    ).order_by(models.Ticket.created_at.desc()).all()
    
    # Dekripsi ciri_barang agar mahasiswa bisa melihat kembali data aslinya
    for ticket in tickets:
        if hasattr(ticket, "ciri_barang") and ticket.ciri_barang:
            ticket.ciri_barang = safe_decrypt(ticket.ciri_barang)
            
    return tickets


# ==========================================
# Admin: Lihat semua tiket yang masuk
# ==========================================
@router.get("/all")
def get_all_tickets(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    tickets = db.query(models.Ticket).all()
    
    # Dekripsi ciri_barang agar Admin dapat melakukan verifikasi teks dengan mudah
    for ticket in tickets:
        if hasattr(ticket, "ciri_barang") and ticket.ciri_barang:
            ticket.ciri_barang = safe_decrypt(ticket.ciri_barang)
            
    return tickets


# ==========================================
# Admin: Update status tiket + kirim notifikasi + buat post otomatis
# ==========================================
@router.patch("/{ticket_id}/status")
def update_ticket_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    request: Request,  # Menambahkan request untuk log IP
    db: Session = Depends(get_db),
    current_admin = Depends(auth.require_admin)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Tiket tidak ditemukan."
        )

    old_status = ticket.status
    ticket.status = data.status

    # Otomatis buat postingan saat diterima admin
    if data.status in ["diproses", "dikonfirmasi"]:
        existing_post = db.query(models.Post).filter(
            models.Post.ticket_id == ticket.id
        ).first()

        if not existing_post:
            # Tetap jaga data terenkripsi atau salin ciri_barang yang sudah aman terenkripsi
            post = models.Post(
                ticket_id=ticket.id,
                admin_id=current_admin.id,  # Menggunakan ID admin yang sedang aktif login
                judul=ticket.nama_barang,
                deskripsi=ticket.deskripsi or "",
                ciri_barang=ticket.ciri_barang,  # Menyalin nilai terenkripsi langsung dari ticket
                lokasi_ditemukan=ticket.lokasi,
                waktu_ditemukan=ticket.waktu_kejadian,
                foto_url=ticket.foto_url,
                status="tersedia"
            )
            db.add(post)

    # Menentukan pesan notifikasi berdasarkan status baru
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

    # Simpan notifikasi otomatis untuk user mahasiswa
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

    # Catat Log: Perubahan Status Tiket Mahasiswa oleh Admin beserta transisinya
    log_activity(
        db=db,
        user_id=current_admin.id,
        user_role="admin",
        action="UPDATE_TICKET_STATUS",
        resource="tickets",
        resource_id=ticket.id,
        ip_address=request.client.host,
        detail=f"Admin merubah status tiket ID {ticket.id} dari '{old_status}' menjadi '{data.status}'"
    )

    return {
        "message": f"Status tiket diperbarui menjadi '{data.status}'."
    }