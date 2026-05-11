from fastapi import APIRouter
# Add the dot (.) before data to tell Python to look in the current package
from ..data.profile_data import PROFILE

router = APIRouter()

@router.get("/profile")
def get_profile():
    return PROFILE