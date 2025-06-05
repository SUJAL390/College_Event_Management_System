# Add this to: c:\Users\97798\Desktop\Esewa\college_event_management_system\college_event_management_system\backend\app\api\api_v1\endpoints\test.py
from fastapi import APIRouter, BackgroundTasks, Depends
from app.services.email import send_email
from app.api import deps
from app.db.models.user import User

router = APIRouter()

@router.post("/test-email")
async def test_email(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Test email sending"""
    await send_email(
        background_tasks=background_tasks,
        subject="Test Email from College Event System",
        email_to=[current_user.email],
        body={
            "title": "Email System Test",
            "content": "This is a test email from your College Event Management System. If you're receiving this, email functionality is working correctly!"
        }
    )
    return {"message": "Test email sent successfully"}