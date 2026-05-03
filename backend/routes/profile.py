from fastapi import APIRouter
from data.profile_data import PROFILE

router = APIRouter()

@router.get("/profile")
def get_profile():
    return PROFILE
