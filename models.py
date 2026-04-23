from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    nim = Column(String(20), unique=True, nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), default="mahasiswa")  # 'mahasiswa' | 'admin'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tickets = relationship("Ticket", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    tipe = Column(String(10), nullable=False)       # 'hilang' | 'temuan'
    nama_barang = Column(String(150), nullable=False)
    deskripsi = Column(Text)
    ciri_barang = Column(Text)
    lokasi = Column(String(200), nullable=False)
    waktu_kejadian = Column(DateTime(timezone=True), nullable=False)
    foto_url = Column(String(500))
    status = Column(String(20), default="menunggu")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="tickets")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    judul = Column(String(200), nullable=False)
    pesan = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")