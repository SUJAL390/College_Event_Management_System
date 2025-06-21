import os
import time
import shutil
from typing import Any
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.api import deps
from app.db.models.user import User
from app.core.config import settings

router = APIRouter()

@router.post("/images", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Upload an image file for events
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )
    
    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join("static", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    timestamp = int(time.time())
    new_filename = f"event_image_{current_user.id}_{timestamp}{file_extension}"
    file_path = os.path.join(uploads_dir, new_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    
    # Return the URL to access the file
    image_url = f"/static/uploads/{new_filename}"
    return {"url": image_url}

@router.options("/images")
async def options_handler():
    return Response(
        content="",
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )