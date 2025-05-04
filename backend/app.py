from flask import Flask, jsonify, render_template, request, url_for, flash, redirect
import sqlite3
from werkzeug.exceptions import abort
# from flask_cors import CORS

def get_db_connection():
    conn = sqlite3.connect('data/database.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)
#CORS(app)  # Allows frontend to communicate with Flask

# Sample profile data
profiles = [
    {"id": 1, "name": "John Doe", "birthday": "1999-03-01"},
    {"id": 2, "name": "Jane Smith", "birthday": "2000-05-15"}
]

@app.route("/friends")
def getFriends():
  return jsonify(profiles)


if __name__ == "__main__":
  app.run(debug=True)
