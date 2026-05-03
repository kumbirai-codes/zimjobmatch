from fastapi import APIRouter, Query
from typing import Optional
from data.jobs_data import JOBS
from data.profile_data import PROFILE
from ai_engine import generate_match

router = APIRouter()


@router.get("/jobs")
def get_jobs(
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    min_match: Optional[int] = Query(0),
):
    results = JOBS

    if search:
        s = search.lower()
        results = [
            j for j in results
            if s in j["title"].lower()
            or s in j["company"].lower()
            or any(s in chip.lower() for chip in j["chips"])
        ]

    if location and location != "All":
        results = [j for j in results if j["location"] == location]

    if type and type != "All":
        results = [j for j in results if j["type"] == type]

    if min_match:
        results = [j for j in results if j["match"] >= min_match]

    return {"jobs": results, "total": len(results)}


@router.get("/jobs/{job_id}")
def get_job(job_id: int):
    job = next((j for j in JOBS if j["id"] == job_id), None)
    if not job:
        return {"error": "Job not found"}
    return job


@router.get("/jobs/{job_id}/ai-match")
def get_ai_match(job_id: int):
    """Generate a real AI match analysis for a specific job"""
    job = next((j for j in JOBS if j["id"] == job_id), None)
    if not job:
        return {"error": "Job not found"}

    ai_result = generate_match(PROFILE, job)

    return {
        "job_id": job_id,
        "job_title": job["title"],
        "company": job["company"],
        **ai_result
    }
