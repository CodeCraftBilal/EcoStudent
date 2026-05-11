from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from .ranking import get_hybrid_recommendations, refresh_models
from .clip_service import get_clip_service

router = APIRouter()

@router.on_event("startup")
async def startup_event():
    # Run once on startup to cache models
    try:
        print("Initializing recommendation models...")
        refresh_models()

        print("Preloading CLIP model...")
        get_clip_service()
    except Exception as e:
        print(f"Failed to initialize models: {e}")

@router.get("/")
async def read_root():
    print("hello world")
    return "hello word"

from fastapi import Request

@router.get('/recommendations/{userId}')
async def get_recommendations(
    request: Request,
    userId: int,
    limit: int = 12,
    offset: int = 0,
    searchQuery: str = None,
    minPrice: float = None,
    maxPrice: float = None,
    maxDistance: float = None,
    lat: float = None,
    lng: float = None
):
    print("A new Recommendation recieved")
    try:
        category = request.query_params.getlist('category')
        condition = request.query_params.getlist('condition')
        exchangeType = request.query_params.getlist('exchangeType')
        
        filters = {
            'searchQuery': searchQuery,
            'category': category,
            'minPrice': minPrice,
            'maxPrice': maxPrice,
            'condition': condition,
            'exchangeType': exchangeType,
            'maxDistance': maxDistance,
            'lat': lat,
            'lng': lng,
            'limit': limit,
            'offset': offset
        }
        
        recommendations = get_hybrid_recommendations(user_id=userId, filters=filters, top_n=limit, offset=offset)
        return recommendations
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post('/recommendations/refresh')
async def trigger_refresh(background_tasks: BackgroundTasks):
    background_tasks.add_task(refresh_models)
    return {"message": "Model refresh started in background"}

from fastapi import UploadFile, File, Form
from sqlalchemy import text
from .clip_service import get_clip_service
from .data_loader import engine

@router.post("/embeddings/product")
async def generate_product_embedding(
    productId: int = Form(...),
    file: UploadFile = File(...)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    content = await file.read()
    
    try:
        clip_service = get_clip_service()
        query_embedding = clip_service.get_embedding(content)
    except Exception as e:
        print(f"Error extracting embedding: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract image embeddings.")
    
    query = text("""
        UPDATE product
        SET embedding = :embedding
        WHERE productid = :productId;
    """)
    
    try:
        with engine.begin() as conn:
            conn.execute(query, {"embedding": str(query_embedding), "productId": productId})
        
        return {"status": "success", "message": "Embedding updated successfully"}
    except Exception as e:
        print(f"Error updating database: {e}")
        raise HTTPException(status_code=500, detail="Database update failed.")

@router.post("/image-search")
async def image_search(
    file: UploadFile = File(...), 
    limit: int = 12,
    offset: int = 0,
    lat: float = None,
    lng: float = None
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    content = await file.read()
    
    try:
        clip_service = get_clip_service()
        query_embedding = clip_service.get_embedding(content)
    except Exception as e:
        print(f"Error extracting embedding: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract image embeddings.")
    
    query = text("""
        SELECT 
            p.productid, 
            p.title, 
            p.description, 
            p.price, 
            p.originalprice, 
            p.productcondition, 
            p.exchangetype, 
            p.images, 
            c.categoryname,
            u.username AS seller_name,
            u.isverified,
            COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.revieweduserid = u.userid), 0) AS rating,
            u.profilepicture,
            u.userid,
            CASE
            WHEN :lat IS NOT NULL AND :lng IS NOT NULL THEN
                (
                    6371 * acos(
                        cos(radians(:lat)) * cos(radians(u.latitude)) *
                        cos(radians(u.longitude) - radians(:lng)) +
                        sin(radians(:lat)) * sin(radians(u.latitude))
                    )
                )
            ELSE 0
            END as distance,
            1 - (p.embedding <=> :embedding) AS similarity
        FROM product p
        LEFT JOIN category c ON p.categoryid = c.categoryid
        LEFT JOIN users u ON p.userid = u.userid
        WHERE p.embedding IS NOT NULL
        ORDER BY p.embedding <=> :embedding
        LIMIT :limit OFFSET :offset
    """)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(query, {"embedding": str(query_embedding), "limit": limit, "offset": offset, "lat": lat,
        "lng": lng,}).fetchall()
        
        matches = [dict(row._mapping) for row in result]
        return {"status": "success", "matches": matches}
    except Exception as e:
        print(f"Error querying database: {e}")
        raise HTTPException(status_code=500, detail="Database query failed.")