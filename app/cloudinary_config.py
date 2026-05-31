import os
import cloudinary
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

print("CLOUD NAME:", os.getenv("CLOUDINARY_CLOUD_NAME"))
print("API KEY:", os.getenv("CLOUDINARY_API_KEY"))
print("API SECRET:", os.getenv("CLOUDINARY_API_SECRET"))