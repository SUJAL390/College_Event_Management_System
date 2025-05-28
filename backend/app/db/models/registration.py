from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..base_class import Base


class Registration(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    event_id = Column(Integer, ForeignKey("event.id"))
    registration_date = Column(DateTime, default=datetime.utcnow)
    check_in_time = Column(DateTime, nullable=True)
    unique_code = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True)
    qr_code_path = Column(String(255), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
