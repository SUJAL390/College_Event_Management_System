import os
from typing import List, Any
import qrcode
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.schemas.registration import Registration, RegistrationCreate, RegistrationWithQR
from app.db.models.registration import Registration as RegistrationModel
from app.db.models.event import Event
from app.db.models.user import User
from app.core.config import settings

router = APIRouter()

def generate_qr_code(registration_id: str, unique_code: str) -> str:
    """Generate QR code for event registration and return the file path"""
  
    os.makedirs(settings.QR_CODE_DIR, exist_ok=True)

    qr_data = f"{registration_id}:{unique_code}"
    
 
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    

    file_path = f"{settings.QR_CODE_DIR}/registration_{registration_id}.png"
    img.save(file_path)
    

    return f"/static/qrcodes/registration_{registration_id}.png"

@router.get("/", response_model=List[Registration])
def list_registrations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve registrations.
    If user is admin, retrieve all registrations.
    If user is regular user, retrieve only their registrations.
    """
    if current_user.is_admin:
        registrations = db.query(RegistrationModel).offset(skip).limit(limit).all()
    else:
        registrations = db.query(RegistrationModel).filter(
            RegistrationModel.user_id == current_user.id
        ).offset(skip).limit(limit).all()
    
    return registrations

@router.post("/", response_model=RegistrationWithQR)
def create_registration(
    *,
    db: Session = Depends(deps.get_db),
    registration_in: RegistrationCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create new registration and generate QR code.
    """
    # Check if event exists
    event = db.query(Event).filter(Event.id == registration_in.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    

    existing_registration = db.query(RegistrationModel).filter(
        RegistrationModel.user_id == current_user.id,
        RegistrationModel.event_id == registration_in.event_id
    ).first()
    
    if existing_registration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already registered for this event"
        )
    
    registered_count = db.query(func.count(RegistrationModel.id)).filter(
        RegistrationModel.event_id == registration_in.event_id
    ).scalar()
    
    if event.capacity and registered_count >= event.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is at full capacity"
        )
    
  
    registration = RegistrationModel(
        user_id=current_user.id,
        event_id=registration_in.event_id
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    
   
    qr_path = generate_qr_code(str(registration.id), registration.unique_code)
    

    registration.qr_code_path = qr_path
    db.commit()
    db.refresh(registration)
    

    return {
        **registration.__dict__,
        "qr_code_url": qr_path
    }

@router.get("/{registration_id}", response_model=RegistrationWithQR)
def get_registration(
    *,
    db: Session = Depends(deps.get_db),
    registration_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get registration by ID.
    """
    registration = db.query(RegistrationModel).filter(RegistrationModel.id == registration_id).first()
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
  
    if not current_user.is_admin and registration.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this registration"
        )
    
    return {
        **registration.__dict__,
        "qr_code_url": registration.qr_code_path
    }

@router.post("/{registration_id}/check-in")
def check_in(
    *,
    db: Session = Depends(deps.get_db),
    registration_id: int,
    unique_code: str,
    current_user: User = Depends(deps.get_current_admin_user)  # Only admins can check in
):
    """
    Check in a participant using their registration QR code.
    """
    registration = db.query(RegistrationModel).filter(RegistrationModel.id == registration_id).first()
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
    
    
    if registration.unique_code != unique_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid check-in code"
        )
    
    if registration.check_in_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked in at " + str(registration.check_in_time)
        )
    
    registration.check_in_time = datetime.utcnow()
    db.commit()
    db.refresh(registration)
    
    return {"status": "success", "message": "Check-in successful"}