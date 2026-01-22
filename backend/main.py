import sqlite3 # For database
from fastapi import FastAPI, HTTPException, Header, Depends # For API and error handling # pyright: ignore[reportMissingImports] 
from pydantic import BaseModel # For request/response models # pyright: ignore[reportMissingImports] 
from passlib.context import CryptContext # pyright: ignore[reportMissingModuleSource] # For password hashing
from fastapi.middleware.cors import CORSMiddleware # For CORS handling # pyright: ignore[reportMissingImports]
import jwt # For user authentication tokens # pyright: ignore[reportMissingImports]
import datetime
import os # For environment variables
from dotenv import load_dotenv # For loading .env files # pyright: ignore[reportMissingImports]

# Load the environment variables to get the secret key
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY found in .env file!")
ALGORITHM = "HS256"

# --- Token Logic ---
def create_access_token(data: dict):
    to_encode = data.copy()
    # Token expires in 24 hours
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Token")
    try:
        # Expecting "Bearer <token>"
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload # This contains username and role
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")

app = FastAPI()

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            role TEXT
        )
    """)
    
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        users = [
            ('admin_user', pwd_context.hash('admin123'), 'admin'),
            ('TM', pwd_context.hash('TM123'), 'trialManager'),
            ('patient', pwd_context.hash('patient123'), 'patient')
        ]
        cursor.executemany("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", users)
        conn.commit()
    conn.close()

init_db()

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
async def login(request: LoginRequest):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username, password_hash, role FROM users WHERE username = ?", (request.username,))
    user = cursor.fetchone()
    conn.close()

    if user and pwd_context.verify(request.password, user[1]):
        # Generate the token
        token = create_access_token({"sub": user[0], "role": user[2]})
        return {"token": token, "username": user[0], "role": user[2]}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/api/admin-only-data")
async def get_admin_data(user_data: dict = Depends(verify_token)):
    if user_data["role"] != "admin":
        raise HTTPException(status_code=403, detail="You are not an admin")
    # Return a message that includes the username (sub) to mirror other dashboards
    return {"message": f"You are {user_data.get('sub')} (admin)"}


@app.get("/api/manager-only-data")
async def get_manager_data(user_data: dict = Depends(verify_token)):
    # Only allow the trialManager role
    if user_data["role"] != "trialManager":
        raise HTTPException(status_code=403, detail="You are not a manager")
    return {"message": f"You are {user_data.get('sub')} (manager)"}


@app.get("/api/patient-only-data")
async def get_patient_data(user_data: dict = Depends(verify_token)):
    # Only allow the patient role
    if user_data["role"] != "patient":
        raise HTTPException(status_code=403, detail="You are not a patient")
    return {"message": f"You are {user_data.get('sub')} (patient)"}