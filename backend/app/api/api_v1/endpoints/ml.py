import pandas as pd
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.db.models.user import User
from app.ml.attendance_predictor import AttendancePredictor
from app.db.models.event import Event
from app.db.models.registration import Registration

router = APIRouter()

class PredictionRequest(BaseModel):
    event_id: int
    user_ids: List[int] = []

class PredictionResult(BaseModel):
    user_id: int
    event_id: int
    attendance_probability: float

@router.post("/predict-attendance", response_model=List[PredictionResult])
def predict_attendance(
    *,
    db: Session = Depends(deps.get_db),
    request: PredictionRequest,
    current_user: User = Depends(deps.get_current_admin_user)  # Only admins can use this
):
    """
    Predict attendance probability for specific users at an event.
    If no user_ids are provided, predicts for all users.
    """
   
    event = db.query(Event).filter(Event.id == request.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if request.user_ids:
        users = db.query(User).filter(User.id.in_(request.user_ids)).all()
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
    else:
       
        users = db.query(User).filter(User.id != current_user.id).all()
    
    prediction_data = []
    for user in users:
        # Get day of week as string (0 = Monday, 6 = Sunday)
        day_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][event.start_time.weekday()]
        
        # Determine time slot (morning, afternoon, evening)
        hour = event.start_time.hour
        if hour < 12:
            time_slot = "morning"
        elif hour < 17:
            time_slot = "afternoon"
        else:
            time_slot = "evening"
        
       
        
        days_to_event = (event.start_time.date() - pd.Timestamp.now(tz='UTC').date()).days

        user_registrations = db.query(Registration).filter(Registration.user_id == user.id).all()
        attended_count = sum(1 for reg in user_registrations if reg.check_in_time is not None)
        user_past_attendance_rate = attended_count / len(user_registrations) if user_registrations else 0
        
        # Get event popularity (% of capacity registered)
        event_registrations = db.query(Registration).filter(Registration.event_id == event.id).count()
        event_popularity = event_registrations / event.capacity if event.capacity else 0
        
        # Count similar events attended (same category)
        similar_events_attended = db.query(Registration).join(Event).filter(
            Registration.user_id == user.id,
            Registration.check_in_time.isnot(None),
            Event.category == event.category
        ).count()
        
        prediction_data.append({
            "user_id": user.id,
            "day_of_week": day_of_week,
            "event_category": event.category or "uncategorized",
            "time_slot": time_slot,
            "days_to_event": days_to_event,
            "user_past_attendance_rate": user_past_attendance_rate,
            "event_popularity": event_popularity,
            "similar_events_attended": similar_events_attended
        })
 
    if not prediction_data:
        return []
    
    df = pd.DataFrame(prediction_data)
    
    
    predictor = AttendancePredictor()
    
    try:
        probabilities = predictor.predict_attendance_probability(df)
    except Exception as e:
        # If prediction fails, return 0.5 probability for everyone
        probabilities = [0.5] * len(df)
    
  
    results = []
    for i, user_data in enumerate(prediction_data):
        results.append({
            "user_id": user_data["user_id"],
            "event_id": request.event_id,
            "attendance_probability": float(probabilities[i])
        })
    
    return results

@router.post("/train-model")
def train_attendance_model(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin_user)  # Only admins can train the model
):
    """
    Train the attendance prediction model using historical data.
    """
    # Get all past events
   
    past_events = db.query(Event).filter(Event.end_time < pd.Timestamp.now(tz='UTC')).all()
    if not past_events:
        raise HTTPException(status_code=400, detail="No past events available for training")
    
    training_data = []
    
    for event in past_events:
        
        registrations = db.query(Registration).filter(Registration.event_id == event.id).all()
        
        for reg in registrations:
            
            user = db.query(User).filter(User.id == reg.user_id).first()
            if not user:
                continue
                
            
            day_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][event.start_time.weekday()]
            
           
            hour = event.start_time.hour
            if hour < 12:
                time_slot = "morning"
            elif hour < 17:
                time_slot = "afternoon"
            else:
                time_slot = "evening"
            

            days_to_event = (event.start_time.date() - reg.registration_date.date()).days
            

            past_registrations = db.query(Registration).filter(
                Registration.user_id == user.id,
                Registration.registration_date < reg.registration_date
            ).all()
            
            past_attended = sum(1 for r in past_registrations if r.check_in_time is not None)
            user_past_attendance_rate = past_attended / len(past_registrations) if past_registrations else 0
            
           
            event_registrations = db.query(Registration).filter(
                Registration.event_id == event.id,
                Registration.registration_date <= reg.registration_date
            ).count()
            
            event_popularity = event_registrations / event.capacity if event.capacity else 0
            
            
            similar_events_attended = db.query(Registration).join(Event).filter(
                Registration.user_id == user.id,
                Registration.registration_date < reg.registration_date,
                Registration.check_in_time.isnot(None),
                Event.category == event.category
            ).count()
            

            attended = 1 if reg.check_in_time is not None else 0
            
            training_data.append({
                "day_of_week": day_of_week,
                "event_category": event.category or "uncategorized",
                "time_slot": time_slot,
                "days_to_event": days_to_event,
                "user_past_attendance_rate": user_past_attendance_rate,
                "event_popularity": event_popularity,
                "similar_events_attended": similar_events_attended,
                "attended": attended
            })
    
    if not training_data:
        raise HTTPException(status_code=400, detail="No training data could be generated")
    

    df = pd.DataFrame(training_data)
    

    try:
        predictor = AttendancePredictor()
        predictor.train(df)
        return {"status": "success", "message": "Model trained successfully", "data_points": len(df)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")