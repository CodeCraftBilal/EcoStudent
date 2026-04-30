from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from .ranking import get_hybrid_recommendations, refresh_models

router = APIRouter()

@router.on_event("startup")
async def startup_event():
    # Run once on startup to cache models
    try:
        print("Initializing recommendation models...")
        refresh_models()
    except Exception as e:
        print(f"Failed to initialize models: {e}")

@router.get("/")
async def read_root():
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