from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routers import auth, tickets, posts, notifications

# Buat semua tabel jika belum ada
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IPB Lost & Found API", version="1.0.0")

# CORS: izinkan React frontend terhubung
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://project-ads.vercel.app",
        "https://project-ads-production-9aeb.up.railway.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(posts.router)
app.include_router(notifications.router)

@app.get("/")
def root():
    return {"message": "IPB Lost & Found API aktif!"}