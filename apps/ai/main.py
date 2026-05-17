from fastapi import FastAPI
from src.routes import router
# from db import db

app = FastAPI()

@app.on_event("startup")
async def startup():
    pass
    # await db.connect()

@app.on_event("shutdown")
async def shutdown():
    pass
    # await db.disconnect()

app.include_router(router)