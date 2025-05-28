from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, events, registrations, users, bug_reports, ml

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(registrations.router, prefix="/registrations", tags=["registrations"])
api_router.include_router(bug_reports.router, prefix="/bugs", tags=["bug reports"])
api_router.include_router(ml.router, prefix="/ml", tags=["machine learning"])
