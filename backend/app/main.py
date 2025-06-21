from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.api_v1.api import api_router
from app.core.config import settings
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI(title=settings.PROJECT_NAME)


origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "http://localhost"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
    expose_headers=["*"], 
)




app.include_router(api_router, prefix=settings.API_V1_STR)
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}