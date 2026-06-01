from pydantic import BaseModel, EmailStr

class AdminRegisterRequest(BaseModel):
    nama: str
    email: EmailStr
    password: str

class MahasiswaLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str