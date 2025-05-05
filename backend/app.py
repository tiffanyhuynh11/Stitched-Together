from flask import Flask, jsonify, render_template, request, url_for, flash, redirect
import sqlite3
from werkzeug.exceptions import abort

def get_db_connection():
    conn = sqlite3.connect('data/database.db')
    conn.row_factory = sqlite3.Row
    return conn

def add_profile(name, birthday, relationship, so, notes, gifts):
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("INSERT INTO profiles (name, birthday, relationship, so, notes, gifts) VALUES (?, ?, ?, ?, ?, ?)",
                 (name, birthday, relationship, so, notes, gifts))

  conn.commit()
  conn.close()


app = Flask(__name__)

# Sample profile data
# profiles = [
#     {"id": 1, "name": "John Doe", "birthday": "1999-03-01"},
#     {"id": 2, "name": "Jane Smith", "birthday": "2000-05-15"},
#     {"id": 3, "name": "Casey", "birthday": "1999-09-26", "aboutMe": "hi"}
# ]

@app.route("/friends")
def getFriends():
  conn = get_db_connection()
  cursor = conn.cursor()

  cursor.execute("SELECT * from profiles")
  profiles = cursor.fetchall()

  conn.close()
  return jsonify([dict(profile) for profile in profiles])



@app.route("/me")
def getUserProfile():
  conn = get_db_connection()
  cursor = conn.cursor()

  cursor.execute("SELECT * from profiles ORDER BY id ASC LIMIT 1")
  profile = cursor.fetchone()

  conn.close()
  if profile:
        return jsonify(dict(profile))
  return jsonify({"error": "Profile not found"}), 404



@app.errorhandler(500)
def handle_500_error(error):
    return jsonify({"error": "Internal Server Error"}), 500



if __name__ == "__main__":
  app.run(debug=True)
