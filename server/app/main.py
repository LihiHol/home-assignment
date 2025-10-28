from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from app.routes.images import router as images_router
from app.routes.annotations import router as annotations_router

app = FastAPI(title="Image Annotation API")  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGE_BASE_DIR = Path(os.getenv("IMAGE_BASE_DIR", r"C:\Users\Omer\Desktop\ib-test\Documents\Images"))
app.mount("/images", StaticFiles(directory=IMAGE_BASE_DIR), name="images")
app.include_router(images_router)
app.include_router(annotations_router)

