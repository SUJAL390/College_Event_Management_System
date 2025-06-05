from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.db.models.user import User as UserModel

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(deps.get_current_active_admin)
):
    
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=UserSchema)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_active_admin)
):

    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists."
        )
    
    new_user = UserModel(
        email=user_in.email,
        username=user_in.username,
        is_admin=user_in.is_admin
    )
    new_user.set_password(user_in.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: UserModel = Depends(deps.get_current_active_user)
):
   
    return current_user