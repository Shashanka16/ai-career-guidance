from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

from routes.auth import router as auth_router
from routes.career import router as career_router
from routes.chatbot import router as chatbot_router

# Import all models so SQLAlchemy creates the tables
from models.users import User
from models.recommendation import Recommendation

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register routes
app.include_router(auth_router, prefix="/auth")
app.include_router(career_router)
app.include_router(chatbot_router)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROOT ROUTE ----------------

@app.get("/")
def home():
    return {
        "message": "AI Career Guidance Backend Running"
    }