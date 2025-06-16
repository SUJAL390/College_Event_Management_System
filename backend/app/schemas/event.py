from typing import Optional
from pydantic import BaseModel, field_validator,ValidationInfo
from datetime import datetime


class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    capacity: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class EventCreate(EventBase):
    title: str
    start_time: datetime
    end_time: datetime
    location: str
    description:str
    capacity:int
    category:str
    
    
    @field_validator('end_time')
    @classmethod # Ensure it's a classmethod if you're using cls
    def end_time_must_be_after_start_time(cls, v: datetime, info: ValidationInfo) -> datetime:
        # 'v' is the value of 'end_time'
        # 'info.data' contains a dictionary of the other fields already validated or being validated.
        if info.data and 'start_time' in info.data and info.data['start_time'] is not None:
            start_time = info.data['start_time']
            if v < start_time:
                raise ValueError('End time must be after start time')
        return v


class EventUpdate(EventBase):
    pass


class EventInDBBase(EventBase):
    id: int
    created_by: int
    created_at: datetime

    model_config = { # Pydantic V2 uses model_config instead of class Config
        "from_attributes": True 
    }


class Event(EventInDBBase):
    pass


class EventWithAttendees(Event):
    registered_count: int
