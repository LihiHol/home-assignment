from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
import os
from app.db.mongo import db 

router = APIRouter(prefix="/api/images", tags=["images"])

@router.get("/")
def get_images():
    """
    Get all images from the collection
    """
    try:
        images = list(db["images"].find({}, {"width": 1, "height": 1, "filename": 1}))
        return [{
            "id": str(img["_id"]),
            "width": int(img["width"]),
            "height": int(img["height"]),
            "filename": img["filename"],
            "url": f"/images/{img['filename']}",
        } for img in images]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching images: {e}")

@router.get("/by-name")
def get_image_by_name(filename: str = Query(...)):
    """
    Resolve a single image by filename
    Verifies it exists in DB (images collection)
    Verifies the file exists on disk (IMAGE_BASE_DIR)
    Returns unified payload {id, filename, width, height, url}
    """
    try:
        # defend against 'C:\\fakepath\\file.jpg' from browsers
        base_name = Path(filename).name
        # IMAGE_BASE_DIR = Path(os.getenv("IMAGE_BASE_DIR", r"C:\Users\Omer\Desktop\ib-test\Documents\Images"))
        doc = db["images"].find_one(
            {"filename": base_name},
            {"_id": 1, "filename": 1, "width": 1, "height": 1},
        )
        if not doc:
            raise HTTPException(status_code=404, detail="Image not found in DB")
        # if not (IMAGE_BASE_DIR / base_name).exists():
        #     raise HTTPException(status_code=404, detail="Image file missing on disk")
        return {
            "id": str(doc["_id"]),
            "filename": doc["filename"],
            "width": int(doc["width"]),
            "height": int(doc["height"]),
            "url": f"/images/{doc['filename']}",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching image by name: {e}")
