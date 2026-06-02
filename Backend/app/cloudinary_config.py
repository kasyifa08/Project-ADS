import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    url=os.environ["CLOUDINARY_URL"],
    secure=True
)