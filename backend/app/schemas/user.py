from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator  # Change validator to field_validator
from datetime import datetime


class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_admin: bool = False


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str
    
    @field_validator('password')  # Use field_validator instead
    @classmethod  # This is required in Pydantic v2
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: int
    created_at: datetime

    class Config:
        # For Pydantic v2
        from_attributes = True  # This replaces orm_mode=True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    password_hash: str