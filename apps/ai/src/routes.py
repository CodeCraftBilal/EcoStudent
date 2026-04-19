from fastapi import APIRouter, HTTPException
from db import db

router = APIRouter()

@router.get("/")
async def read_root():
    return "hello word"

@router.get('/recommendation/userid')
async def get_recommendation():
    try: 
        product = await db.product.find_many()
        return product
    except Exception as e:
        print(str(e));
        return {"success": False, "message": "Something went wrong"}