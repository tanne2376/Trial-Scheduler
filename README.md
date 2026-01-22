# Clinical Trial Scheduler Project
Full stack clinical trial scheduler web app, using sqlite, python and react.

## Setup
### Backend
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn "passlib[bcrypt]" bcrypt==4.0.1 pyjwt python-dotenv
uvicorn main:app --reload
```
You will need to create a .env file containing "SECRET_KEY={some long random string}", to allow for strong user authentication.

### Frontend
```
cd frontend
npm install
npm run dev
```

## Demo Credentials
| Username | Password |
|---       | ---      |
|admin_user|admin123  |
|TM        |TM123     |
|patient   |patient123|
