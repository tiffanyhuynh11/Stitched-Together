@echo off
REM Create a Python virtual environment
python -m venv env

REM Activate the virtual environment
call env\Scripts\activate

REM Install dependencies from requirements.txt
pip install -r requirements.txt

REM Open two Command Prompt windows for backend and frontend
start cmd /k "cd /d backend && python app.py"
start cmd /k "cd /d frontend && npm start"