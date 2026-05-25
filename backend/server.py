from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timedelta
import random
import hashlib


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    full_name: str
    role: Literal["normal_user", "individual_worker", "business_owner"]
    password_hash: str
    is_verified: bool = False
    worker_verified: bool = False
    business_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RegisterRequest(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    full_name: str
    password: str
    role: Literal["normal_user", "individual_worker", "business_owner"]

class LoginRequest(BaseModel):
    email_or_mobile: str
    password: str

class VerifyOTPRequest(BaseModel):
    email_or_mobile: str
    otp: str

class SendOTPRequest(BaseModel):
    email_or_mobile: str

# OTP Model (Mock OTP storage)
class OTP(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email_or_mobile: str
    otp: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Worker Verification Models
class WorkerProfile(BaseModel):
    user_id: str
    skills: List[str] = []
    experience: str = ""
    languages: List[str] = []
    hourly_rate: float = 0.0
    service_radius: float = 0.0
    profile_image: Optional[str] = None

class WorkerVerification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    front_id: str  # base64 image
    back_id: str   # base64 image
    selfie: str    # base64 image
    status: Literal["pending", "approved", "rejected"] = "pending"
    rejection_reason: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None

class WorkerVerificationSubmit(BaseModel):
    front_id: str
    back_id: str
    selfie: str

# Business Verification Models
class BusinessVerification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_name: str
    business_category: str
    business_address: str
    phone_number: str
    business_email: EmailStr
    business_license: str  # base64 document
    tax_document: Optional[str] = None  # base64 document
    logo: Optional[str] = None  # base64 image
    cover_image: Optional[str] = None  # base64 image
    service_categories: List[str] = []
    service_radius: float = 0.0
    business_location: dict = {}
    status: Literal["pending", "approved", "rejected"] = "pending"
    rejection_reason: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None

class BusinessVerificationSubmit(BaseModel):
    business_name: str
    business_category: str
    business_address: str
    phone_number: str
    business_email: EmailStr
    business_license: str
    tax_document: Optional[str] = None
    logo: Optional[str] = None
    cover_image: Optional[str] = None
    service_categories: List[str] = []
    service_radius: float = 0.0
    business_location: dict = {}

class BecomeWorkerRequest(BaseModel):
    skills: List[str]
    experience: str
    languages: List[str]
    hourly_rate: float
    service_radius: float
    profile_image: Optional[str] = None


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash

def generate_otp() -> str:
    # Mock OTP - always return 123456 for development
    return "123456"


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(request: RegisterRequest):
    # Check if user already exists
    existing_user = None
    if request.email:
        existing_user = await db.users.find_one({"email": request.email})
    elif request.mobile:
        existing_user = await db.users.find_one({"mobile": request.mobile})
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create user
    user = User(
        email=request.email,
        mobile=request.mobile,
        full_name=request.full_name,
        password_hash=hash_password(request.password),
        role=request.role,
        is_verified=False
    )
    
    await db.users.insert_one(user.dict())
    
    # Send OTP (mock)
    otp = generate_otp()
    otp_obj = OTP(
        email_or_mobile=request.email or request.mobile,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    await db.otps.insert_one(otp_obj.dict())
    
    return {
        "success": True,
        "message": "Registration successful. OTP sent.",
        "user_id": user.id,
        "otp": otp  # Return OTP for development (remove in production)
    }

@api_router.post("/auth/login")
async def login(request: LoginRequest):
    # Find user by email or mobile
    user = await db.users.find_one({
        "$or": [
            {"email": request.email_or_mobile},
            {"mobile": request.email_or_mobile}
        ]
    })
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify password
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    
    # Send OTP if not verified
    if not user.get("is_verified", False):
        otp = generate_otp()
        otp_obj = OTP(
            email_or_mobile=request.email_or_mobile,
            otp=otp,
            expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        await db.otps.insert_one(otp_obj.dict())
        
        return {
            "success": True,
            "message": "OTP sent for verification",
            "requires_otp": True,
            "user_id": user["id"],
            "otp": otp  # Return OTP for development
        }
    
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "email": user.get("email"),
            "mobile": user.get("mobile"),
            "full_name": user["full_name"],
            "role": user["role"],
            "worker_verified": user.get("worker_verified", False),
            "business_verified": user.get("business_verified", False)
        }
    }

@api_router.post("/auth/send-otp")
async def send_otp(request: SendOTPRequest):
    # Generate and store OTP
    otp = generate_otp()
    otp_obj = OTP(
        email_or_mobile=request.email_or_mobile,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    await db.otps.insert_one(otp_obj.dict())
    
    return {
        "success": True,
        "message": "OTP sent successfully",
        "otp": otp  # Return OTP for development
    }

@api_router.post("/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    # Find OTP
    otp_record = await db.otps.find_one({
        "email_or_mobile": request.email_or_mobile,
        "otp": request.otp
    })
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )
    
    # Check expiration
    if datetime.utcnow() > otp_record["expires_at"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
        )
    
    # Mark user as verified
    user = await db.users.find_one({
        "$or": [
            {"email": request.email_or_mobile},
            {"mobile": request.email_or_mobile}
        ]
    })
    
    if user:
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
        )
    
    # Delete used OTP
    await db.otps.delete_one({"id": otp_record["id"]})
    
    return {
        "success": True,
        "message": "OTP verified successfully",
        "user": {
            "id": user["id"],
            "email": user.get("email"),
            "mobile": user.get("mobile"),
            "full_name": user["full_name"],
            "role": user["role"],
            "worker_verified": user.get("worker_verified", False),
            "business_verified": user.get("business_verified", False)
        }
    }


# ==================== USER ROUTES ====================

@api_router.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Remove password hash
    user.pop("password_hash", None)
    user.pop("_id", None)
    
    return {"success": True, "user": user}

@api_router.post("/user/become-worker")
async def become_worker(request: BecomeWorkerRequest, user_id: str):
    # Update user role to include worker
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create worker profile
    worker_profile = WorkerProfile(
        user_id=user_id,
        skills=request.skills,
        experience=request.experience,
        languages=request.languages,
        hourly_rate=request.hourly_rate,
        service_radius=request.service_radius,
        profile_image=request.profile_image
    )
    
    await db.worker_profiles.insert_one(worker_profile.dict())
    
    return {
        "success": True,
        "message": "Worker profile created. Please complete verification."
    }


# ==================== WORKER VERIFICATION ROUTES ====================

@api_router.post("/worker/verification")
async def submit_worker_verification(verification: WorkerVerificationSubmit, user_id: str):
    # Check if verification already exists
    existing = await db.worker_verifications.find_one({"user_id": user_id})
    if existing and existing.get("status") == "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification already pending"
        )
    
    # Create verification
    worker_verification = WorkerVerification(
        user_id=user_id,
        front_id=verification.front_id,
        back_id=verification.back_id,
        selfie=verification.selfie
    )
    
    await db.worker_verifications.insert_one(worker_verification.dict())
    
    return {
        "success": True,
        "message": "Verification submitted successfully",
        "verification_id": worker_verification.id
    }

@api_router.get("/worker/verification/{user_id}")
async def get_worker_verification(user_id: str):
    verification = await db.worker_verifications.find_one({"user_id": user_id})
    if not verification:
        return {"success": True, "verification": None}
    
    verification.pop("_id", None)
    return {"success": True, "verification": verification}


# ==================== BUSINESS VERIFICATION ROUTES ====================

@api_router.post("/business/verification")
async def submit_business_verification(verification: BusinessVerificationSubmit, user_id: str):
    # Check if verification already exists
    existing = await db.business_verifications.find_one({"user_id": user_id})
    if existing and existing.get("status") == "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification already pending"
        )
    
    # Create verification
    business_verification = BusinessVerification(
        user_id=user_id,
        **verification.dict()
    )
    
    await db.business_verifications.insert_one(business_verification.dict())
    
    return {
        "success": True,
        "message": "Business verification submitted successfully",
        "verification_id": business_verification.id
    }

@api_router.get("/business/verification/{user_id}")
async def get_business_verification(user_id: str):
    verification = await db.business_verifications.find_one({"user_id": user_id})
    if not verification:
        return {"success": True, "verification": None}
    
    verification.pop("_id", None)
    return {"success": True, "verification": verification}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
