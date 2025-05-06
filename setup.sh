#!/bin/bash

# Create a Python virtual environment
python3 -m venv env

# Activate the virtual environment
source env/bin/activate

# Install dependencies from requirements.txt
pip install -r requirements.txt

# Open two Terminal windows for backend and frontend
osascript -e 'tell application "Terminal" to do script "cd backend && source env/bin/activate && python3 app.py"'
osascript -e 'tell application "Terminal" to do script "cd frontend && npm start"'