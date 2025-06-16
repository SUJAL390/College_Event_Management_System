from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "http://localhost"]

# Set up CORS with FastAPI's built-in middleware
# This should be sufficient and correctly handle the Access-Control-Allow-Origin header.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # FastAPI handles matching the request origin against this list
    allow_credentials=True,
    allow_methods=["*"], # Allows all standard methods
    allow_headers=["*"], # Allows all headers
    expose_headers=["*"], # Optional: if your frontend needs to access custom headers
)

# Remove or comment out your custom middleware as it's causing the issue
# @app.middleware("http")
# async def add_cors_header(request: Request, call_next):
#     if request.method == "OPTIONS":
#         response = Response(
#             content="",
#             status_code=200,
#             headers={
#                 "Access-Control-Allow-Origin": ", ".join(origins), # This was the problematic line
#                 "Access-Control-Allow-Methods": "POST, GET, DELETE, PATCH, OPTIONS",
#                 "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
#                 "Access-Control-Allow-Credentials": "true",
#                 "Access-Control-Max-Age": "86400",
#             },
#         )
#         return response
    
#     response = await call_next(request)
    
#     response.headers["Access-Control-Allow-Origin"] = ", ".join(origins) # This was also problematic
#     response.headers["Access-Control-Allow-Credentials"] = "true"
    
#     return response

app.include_router(api_router, prefix=settings.API_V1_STR)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}