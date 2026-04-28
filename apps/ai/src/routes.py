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

@router.get('/recommendations/{userId}')
async def get_recommendations(userId: int, limit: int = 10):
    try:
        recommendations = get_hybrid_recommendations(userId, top_n=limit)
        return recommendations
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post('/recommendations/refresh')
async def trigger_refresh(background_tasks: BackgroundTasks):
    background_tasks.add_task(refresh_models)
    return {"message": "Model refresh started in background"}