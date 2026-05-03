from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs, profile

app = FastAPI(title="ZimJobMatch API", version="1.0.0")

# Allow the React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(jobs.router, prefix="/api")
app.include_router(profile.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ZimJobMatch API is running ✦"}
