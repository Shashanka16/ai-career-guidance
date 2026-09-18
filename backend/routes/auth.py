from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from database import SessionLocal
from models.users import User

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str


# ---------------- REGISTER ----------------

@router.post("/register")
def register(user: RegisterUser):

    db = SessionLocal()

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Create new user
    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    db.close()

    return {
        "message": "User registered successfully"
    }


# ---------------- LOGIN ----------------

@router.post("/login")
def login(user: LoginUser):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user is None:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify hashed password
    if not pwd_context.verify(
        user.password,
        existing_user.password
    ):
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    username = existing_user.username

    db.close()

    return {
    "message": "Login Successful",
    "id": existing_user.id,
    "username": existing_user.username,
    "email": existing_user.email
    }


# ---------------- GET USERS ----------------

@router.get("/users")
def get_users():

    db = SessionLocal()

    users = db.query(User).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })

    db.close()

    return result