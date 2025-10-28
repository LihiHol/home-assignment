from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
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

# @app.get("/images/{filename}")
# def get_image_file(filename: str):
#     safe = Path(filename).name
#     path = (IMAGE_BASE_DIR / safe).resolve()
#     if not path.exists():
#         raise HTTPException(404, "Image not found")
#     mime, _ = mimetypes.guess_type(path.name)
#     return FileResponse(str(path), media_type=mime or "application/octet-stream")

app.include_router(images_router)
app.include_router(annotations_router)

