from fastapi import APIRouter, HTTPException
from db import db

router = APIRouter()

@router.get("/")
async def read_root():
    print('request revieved')
    try:
        user = await db.users.find_first()
        return {"user": user,"message": "Welcome to EcoStudent AI Recommendation Service"}
    except:
        return {"message": "something went wrong"}
