from fastapi import APIRouter, Query, HTTPException
from app.db.mongo import db

router = APIRouter(prefix="/api/annotations", tags=["annotations"])

# @router.get("/by-id")
# def get_annotations(image_id: str = Query(...), min_score: float = Query(0.0)):
#     """
#     Fetch annotations for a given image_id (string from MongoDB),
#     and filter by a minimum score threshold.
#     """
#     try:
#         annotations = list(
#             db["annotations"].find(
#                 {"image_id": image_id, "score": {"$gte": float(min_score)}},
#                 {"x": 1, "y": 1, "width": 1, "height": 1, "image_id": 1, "score": 1}
#             )
#         )
#         return [
#             {
#                 "id": str(a["_id"]),
#                 "x": a["x"],
#                 "y": a["y"],
#                 "width": a["width"],
#                 "height": a["height"],
#                 "image_id": a["image_id"],
#                 "score": a["score"]
#             }
#             for a in annotations
#         ]
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Error fetching annotations: {e}")

@router.get("/by-id")
def get_annotations(image_id: str = Query(...), min_score: float = Query(0.0)):
    """
    Fetch annotations for a given image_id (supports both str and ObjectId),
    filtered by minimum score.
    """
    try:
        # $or to match either string or ObjectId storage
        or_clauses = [{"image_id": image_id}]
        try:
            oid = ObjectId(image_id)          # add ObjectId forms too
            or_clauses.append({"image_id": oid})
            or_clauses.append({"image_id": str(oid)})
        except Exception:
            oid = None  # not a valid ObjectId; ignore

        query = {
            "$and": [
                {"score": {"$gte": float(min_score)}},
                {"$or": or_clauses},
            ]
        }

        projection = {
            "x": 1, "y": 1, "width": 1, "height": 1,
            "image_id": 1, "score": 1
        }

        annotations = list(db["annotations"].find(query, projection))

        return [
            {
                "id": str(a["_id"]),
                "x": a["x"],
                "y": a["y"],
                "width": a["width"],
                "height": a["height"],
                # normalize to string for a consistent API
                "image_id": str(a.get("image_id")),
                "score": a.get("score"),
            }
            for a in annotations
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching annotations: {e}")

@router.get("/by-name")
def get_annotations_by_filename(
    filename: str = Query(...),
    min_score: float = Query(0.0)
):
    """
    Fetch annotations by image filename.
    Backward-compatible query: supports annotations.image_id stored as str OR ObjectId.
    """
    try:
        # normalize filename
        fname = Path(filename).name
        # find the image doc by filename
        image = db["images"].find_one(
            {"filename": fname}, {"_id": 1, "filename": 1})
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")

        oid = image["_id"]                 # ObjectId
        oid_str = str(oid)                 # legacy string form

        # filter on min_score
        q = {
            "score": {"$gte": float(min_score)},
            "$or": [
                # annotations.image_id stored as ObjectId
                {"image_id": oid},
                {"image_id": oid_str},     # annotations.image_id stored as string
            ],
        }

        proj = {"x": 1, "y": 1, "width": 1,
                "height": 1, "image_id": 1, "score": 1}
        anns = list(db["annotations"].find(q, proj))

        # normalize ids to strings for JSON
        return [
            {
                "id": str(a["_id"]),
                "x": a["x"],
                "y": a["y"],
                "width": a["width"],
                "height": a["height"],
                "image_id": str(a["image_id"]) if a.get("image_id") is not None else None,
                "score": a["score"],
            }
            for a in anns
        ]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching annotations: {e}")
