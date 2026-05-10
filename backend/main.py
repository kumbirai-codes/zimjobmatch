from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs, profile

app = FastAPI(title="ZimJobMatch API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api")
app.include_router(profile.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ZimJobMatch API is running "}