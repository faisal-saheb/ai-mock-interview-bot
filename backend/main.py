from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interview
from database import init_db

app = FastAPI()

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api")

@app.get("/")
def home():
    return {"message": "AI Mock Interview Bot Backend is Running! 🚀"}