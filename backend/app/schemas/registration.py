from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class RegistrationBase(BaseModel):
    user_id: Optional[int] = None
    event_id: Optional[int] = None


class RegistrationCreate(RegistrationBase):
    event_id: int


class RegistrationUpdate(RegistrationBase):
    check_in_time: Optional[datetime] = None


class RegistrationInDBBase(RegistrationBase):
    id: int
    user_id: int
    event_id: int
    registration_date: datetime
    check_in_time: Optional[datetime] = None
    unique_code: str

    class Config:
        orm_mode = True


class Registration(RegistrationInDBBase):
    pass


class RegistrationWithQR(Registration):
    qr_code_url: str