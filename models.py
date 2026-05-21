from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

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
    deskripsi = Column(Text)
    ciri_barang = Column(Text)
    lokasi = Column(String(200), nullable=False)
    waktu_kejadian = Column(DateTime(timezone=True), nullable=False)
    foto_url = Column(String(500))
    status = Column(Enum("pending", "approved", "rejected", name="ticket_status"), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    mahasiswa = relationship("Mahasiswa", back_populates="tickets")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    judul = Column(String(200), nullable=False)
    deskripsi = Column(Text, nullable=False)
    lokasi_ditemukan = Column(String(200))
    waktu_ditemukan = Column(DateTime(timezone=True))
    foto_url = Column(String(500))
    status = Column(String(20), default="tersedia")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mahasiswa.id", ondelete="CASCADE"))
    judul = Column(String(200), nullable=False)
    pesan = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    mahasiswa = relationship("Mahasiswa", back_populates="notifications")