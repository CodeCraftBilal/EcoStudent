from fastapi import APIRouter, HTTPException
from db import db
from fastapi import Request

router = APIRouter()

@router.get("/")
async def read_root():
    return "hello word"

@router.get('/recommendation/userid')
async def get_recommendation(request: Request):
    try: 
        params = request.query_params
        params = dict(params)
        limit = 12
        skip = (params.get("offset") - 1)* limit
        print("Params: ", dict(params))
        product = await db.product.find_many(
            skip=skip, 
            take=limit
        )
        return product
    except Exception as e:
        print(str(e))
        return {"success": False, "message": "Something went wrong"}