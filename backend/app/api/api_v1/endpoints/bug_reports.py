from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_items():
    return {"message": "Endpoint works"}
