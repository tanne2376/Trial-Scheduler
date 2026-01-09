import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext # For password hashing
from fastapi.middleware.cors import CORSMiddleware

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
    # 1. Added password_hash column
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
        # 2. Store the HASH, not the word "password123"
        users = [
            ('admin_user', pwd_context.hash('admin123'), 'admin'),
            ('TM_joe', pwd_context.hash('TM123'), 'TrialManager'),
            ('patient_alice', pwd_context.hash('patient123'), 'patient')
        ]
        cursor.executemany("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", users)
        conn.commit()
    conn.close()

init_db()

class LoginRequest(BaseModel):
    username: str
    password: str # Added password field

@app.post("/api/login")
async def login(request: LoginRequest):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username, password_hash, role FROM users WHERE username = ?", (request.username,))
    user = cursor.fetchone()
    conn.close()

    if user and pwd_context.verify(request.password, user[1]): # Verify hash
        return {"username": user[0], "role": user[2]}
    else:
        # Safety tip: Don't tell them if it was the username or password that was wrong
        raise HTTPException(status_code=401, detail="Invalid credentials")