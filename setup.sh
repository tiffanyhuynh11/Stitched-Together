#!/bin/bash

echo "Creating and activating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing backend dependencies..."
cd backend || exit
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Backend installation failed."
    exit 1
fi
cd ..

echo "Installing frontend dependencies..."
cd frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo "Frontend installation failed."
    exit 1
fi
cd ..

echo "Running database initialization..."
cd backend || exit
python3 init_db.py
cd ..

echo "Setup complete! Run front and back ends via terminal!"

