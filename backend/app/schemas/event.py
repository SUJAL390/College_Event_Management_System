from typing import Optional
from pydantic import BaseModel, field_validator
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
    
    @field_validator('end_time')
    def end_time_must_be_after_start_time(cls, v, values):
        if 'start_time' in values and v < values['start_time']:
            raise ValueError('End time must be after start time')
        return v


class EventUpdate(EventBase):
    pass


class EventInDBBase(EventBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True


class Event(EventInDBBase):
    pass


class EventWithAttendees(Event):
    registered_count: int
