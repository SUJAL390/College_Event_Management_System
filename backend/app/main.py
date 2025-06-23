import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)



app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,         
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],         
    expose_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

if os.path.isdir("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
