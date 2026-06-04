from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, Text

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    nama = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)

class Mahasiswa(Base):
    __tablename__ = "mahasiswa"

    id = Column(Integer, primary_key=True, index=True)
    nim = Column(String, unique=True, nullable=False)
    nama = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    no_telp = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

    tickets = relationship("Ticket", back_populates="mahasiswa")
    notifications = relationship("Notification", back_populates="mahasiswa")

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mahasiswa.id", ondelete="CASCADE"))
    tipe = Column(String(10), nullable=False)       # 'hilang' | 'temuan'
    nama_barang = Column(String(150), nullable=False)
    kategori = Column(String(100))
    deskripsi = Column(Text)
    ciri_barang = Column(Text)
    no_telp = Column(String(13))
    lokasi = Column(String(200), nullable=False)
    waktu_kejadian = Column(DateTime(timezone=True), nullable=False)
    foto_url = Column(String(500))
    warna = Column(String, nullable=True)
    status = Column(String(20), default="menunggu")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    mahasiswa = relationship("Mahasiswa", back_populates="tickets")
    notifications = relationship(
    "Notification",
    back_populates="ticket"
)

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    tipe = Column(String(10), nullable=True)
    judul = Column(String(200), nullable=False)
    deskripsi = Column(Text, nullable=False)
    lokasi_ditemukan = Column(String(200))
    waktu_ditemukan = Column(DateTime(timezone=True))
    warna = Column(String)
    foto_url = Column(String(500))
    status = Column(String(20), default="tersedia")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    kategori = Column(String(100), nullable=True)
    ciri_barang = Column(Text, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("mahasiswa.id", ondelete="CASCADE"))
    ticket_id = Column(Integer,ForeignKey("tickets.id", ondelete="CASCADE"),nullable=True)
    judul = Column(String(200), nullable=False)
    pesan = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now())

    mahasiswa = relationship("Mahasiswa",back_populates="notifications")
    ticket = relationship("Ticket",back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    user_role = Column(String(20), nullable=False)   # 'mahasiswa' | 'admin'
    action = Column(String(100), nullable=False)      # 'LOGIN', 'CREATE_TICKET', dll
    resource = Column(String(50), nullable=True)      # tabel/resource yang diakses
    resource_id = Column(Integer, nullable=True)      # ID record yang diakses
    ip_address = Column(String(45), nullable=True)    # IPv4/IPv6
    detail = Column(Text, nullable=True)              # info tambahan (JSON string)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

# ── Action Constants ──────────────────────────────────────────────────────────

class AuditAction:
    # Auth
    LOGIN_SUCCESS = "LOGIN_SUCCESS"
    LOGIN_FAILED = "LOGIN_FAILED"
    LOGOUT = "LOGOUT"
    REGISTER = "REGISTER"

    # Ticket
    TICKET_CREATE = "TICKET_CREATE"
    TICKET_VIEW = "TICKET_VIEW"
    TICKET_STATUS_UPDATE = "TICKET_STATUS_UPDATE"
    TICKET_DELETE = "TICKET_DELETE"

    # Admin
    POST_CREATE = "POST_CREATE"
    POST_UPDATE = "POST_UPDATE"

    # Security events
    BRUTE_FORCE_LOCKOUT = "BRUTE_FORCE_LOCKOUT"
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
    DECRYPTION_ERROR = "DECRYPTION_ERROR"