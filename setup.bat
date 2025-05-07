@echo off

echo Creating virtual environment...
python -m venv venv

echo Installing backend dependencies...
cd backend
call ..\venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Backend installation failed.
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed.
    exit /b 1
)
cd ..

echo Running database initialization...
cd backend
python init_db.py
cd ..

echo Setup complete! Run front and back ends via terminal!
REM it works