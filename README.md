# Clinical Trial Scheduler Project
Full stack clinical trial scheduler web app, using sqlite, python and react.

## Setup
### Backend
___
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn "passlib[bcrypt]" bcrypt==4.0.1 pyjwt python-dotenv
uvicorn main:app --reload
___
You will need to create a .env file containing "SECRET_KEY={some long random string}", to allow for strong user authentication.

### Frontend
___
cd frontend
npm install
npm run dev
___

## Demo Credentials
| Username | Password |
|---       | ---      |
|admin_user|admin123  |
|TM        |TM123     |
|patient   |patient123|
