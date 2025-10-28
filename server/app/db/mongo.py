# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os

# load_dotenv()

# try:
#     client = MongoClient(
#         host=os.getenv("MONGODB_HOST"),
#         port=int(os.getenv("MONGODB_PORT")),
#         username=os.getenv("MONGODB_USER"),
#         password=os.getenv("MONGODB_PASSWORD"),
#         uuidRepresentation="standard"
#     )
#     db = client[os.getenv("MONGODB_DATABASE")]
#     print("✅ Connected successfully to MongoDB")
# except Exception as e:
#     print("❌ Failed to connect to MongoDB:", e)


import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

USE_FAKE = os.getenv("USE_FAKE_DB", "0") == "1"

db = None  # will be set below


# def _seed_fake_data(_db):
#     """Insert minimal fake documents so endpoints return real data."""
#     # images
#     if _db["images"].count_documents({}) == 0:
#         img_id = _db["images"].insert_one({
#             "filename": "dhgdfjjdf-873v-df.jpg",
#             "width": 1920,
#             "height": 1080,
#         }).inserted_id

#         # annotations (normalized [0..1])
#         _db["annotations"].insert_many([
#             {
#                 "x": 0.70, "y": 0.74, "width": 0.04, "height": 0.27,
#                 "image_id": str(img_id), "score": 0.92,
#             },
#             {
#                 "x": 0.30, "y": 0.35, "width": 0.10, "height": 0.15,
#                 "image_id": str(img_id), "score": 0.55,
#             },
#         ])

def _seed_fake_data(_db):
    """Insert minimal fake documents so endpoints return real data."""
    # seed only if empty
    if _db["images"].count_documents({}) == 0:
        # first image (original)
        img1_id = _db["images"].insert_one({
            "filename": "dhgdfjjdf-873v-df.jpg",
            "width": 1920,
            "height": 1080,
        }).inserted_id

        # annotations for first image
        _db["annotations"].insert_many([
            {
                "x": 0.70, "y": 0.74, "width": 0.04, "height": 0.27,
                "image_id": str(img1_id), "score": 0.92,
            },
            {
                "x": 0.30, "y": 0.35, "width": 0.10, "height": 0.15,
                "image_id": str(img1_id), "score": 0.55,
            },
        ])

        # second image (new one, 700x700)
        img2_id = _db["images"].insert_one({
            "filename": "BJmivOzyq_0_0_2500_1679_0_x-large.jpg",
            "width": 700,
            "height": 700,
        }).inserted_id

        # 3 annotations for second image
        _db["annotations"].insert_many([
            {
                "x": 0.15, "y": 0.20, "width": 0.10, "height": 0.10,
                "image_id": str(img2_id), "score": 0.80,
            },
            {
                "x": 0.50, "y": 0.55, "width": 0.15, "height": 0.20,
                "image_id": str(img2_id), "score": 0.65,
            },
            {
                "x": 0.70, "y": 0.25, "width": 0.08, "height": 0.12,
                "image_id": str(img2_id), "score": 0.93,
            },
        ])

print("✅ Seeded 2 images + 5 annotations")

def _connect_real():
    from pymongo import MongoClient
    client = MongoClient(
        host=os.getenv("MONGODB_HOST"),
        port=int(os.getenv("MONGODB_PORT")),
        username=os.getenv("MONGODB_USER") or None,
        password=os.getenv("MONGODB_PASSWORD") or None,
        uuidRepresentation="standard",
    )
    return client[os.getenv("MONGODB_DATABASE")]

def _connect_fake():
    import mongomock
    client = mongomock.MongoClient()
    _db = client[os.getenv("MONGODB_DATABASE", "ib_test")]
    _seed_fake_data(_db)
    return _db


try:
    if USE_FAKE:
        db = _connect_fake()
        print("✅ Using in-memory Mongo (mongomock) with seeded data")
    else:
        db = _connect_real()
        db.command("ping")
        print("✅ Connected successfully to MongoDB")
except Exception as e:
    # fallback: if real connection failed, use fake to keep working at home
    print("⚠️ Mongo connection failed, falling back to mongomock:", e)
    db = _connect_fake()
