from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.schemas.event import Event, EventCreate, EventUpdate, EventWithAttendees
from app.db.models.event import Event as EventModel
from app.db.models.registration import Registration
from app.db.models.user import User

router = APIRouter()

@router.get("/", response_model=List[EventWithAttendees])
def list_events(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve events with optional filtering by category.
    """
    query = db.query(EventModel)
    
   
    if category:
        query = query.filter(EventModel.category == category)
    
    events = query.offset(skip).limit(limit).all()
    
 
    result = []
    for event in events:
        registered_count = db.query(func.count(Registration.id)).filter(
            Registration.event_id == event.id
        ).scalar()
        
        event_dict = {**event.__dict__}
        event_dict["registered_count"] = registered_count
        result.append(event_dict)
    
    return result

@router.post("/", response_model=Event)
def create_event(
    *,
    db: Session = Depends(deps.get_db),
    event_in: EventCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create new event.
    """
    event = EventModel(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        capacity=event_in.capacity,
        category=event_in.category,
        image_url=event_in.image_url,
        created_by=current_user.id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/{event_id}", response_model=EventWithAttendees)
def get_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get event by ID.
    """
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    registered_count = db.query(func.count(Registration.id)).filter(
        Registration.event_id == event.id
    ).scalar()
    
    event_dict = {**event.__dict__}
    event_dict["registered_count"] = registered_count
    
    return event_dict

@router.put("/{event_id}", response_model=Event)
def update_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: int,
    event_in: EventUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update event by ID.
    """
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    

    if not current_user.is_admin and event.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this event"
        )
    
    
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete event by ID.
    """
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    

    if not current_user.is_admin and event.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this event"
        )
    
    db.delete(event)
    db.commit()
    return None