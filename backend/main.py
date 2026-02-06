import hashlib
import re

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import SessionLocal, engine
from database import Base
import models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

GMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@gmail\.com$")


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    fullname: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=6, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)


class RegisterResponse(BaseModel):
    message: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@app.get("/")
def root():
    return {"message": "Backend + DB connected"}


@app.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    print("📥 Incoming payload:", payload)

    if not GMAIL_PATTERN.match(payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email must be a valid Gmail address."
        )

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    user = models.User(
        username=payload.username,
        fullname=payload.fullname,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        print("✅ User saved with ID:", user.id)
        return {"message": "Registration successful."}

    except IntegrityError as e:
        db.rollback()
        # Very likely unique constraint violation on email
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,          # 409 = Conflict
            detail="This email is already registered."
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration."
        )