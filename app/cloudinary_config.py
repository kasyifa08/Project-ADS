import cloudinary
import os

cloudinary.config(cloudinary_url=os.getenv("CLOUDINARY_URL"))