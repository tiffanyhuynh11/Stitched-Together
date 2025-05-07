# Stitched-Together
## How to run (Windows)
To run Stitched Together, first ensure that your computer has Python 3 and Node.js installed. 

From the GitHub repository, download the zip of the project.

In a Command Prompt window in the root directory, run the following commands:
```
python -m venv venv
.\venv\Scripts\activate.bat
cd backend
pip install -r requirements.txt
python init_db.py
cd ..
cd frontend
npm install
```
Once setup is complete, open 2 terminal windows or tabs and activate the virtual environment in each, using .\venv\Scripts\activate.bat

In the first terminal, navigate to the backend subdirectory and run python app.py

In the second terminal, navigate to the frontend subdirectory and run npm start

Stitched Together will then open in your browser, ready to use!
