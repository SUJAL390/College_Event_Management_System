from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..base_class import Base


class Event(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text)
    location = Column(String(200))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    capacity = Column(Integer)
    created_by = Column(Integer, ForeignKey("user.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    category = Column(String(50))
    image_url = Column(String(255))
    
    # Relationships
    creator = relationship("User", back_populates="created_events")
    registrations = relationship("Registration", back_populates="event")
