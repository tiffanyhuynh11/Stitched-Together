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



@app.route("/profile", methods=['GET', 'POST'])
def userProfile():
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch User's Profile
  if request.method == 'GET':
        cursor.execute("SELECT * FROM profiles ORDER BY id ASC LIMIT 1")
        profile = cursor.fetchone()
        conn.close()

        if profile:
            return jsonify(dict(profile))
        return jsonify({"error": "Profile not found"}), 404

  # update User's profile
  elif request.method == 'POST':
        data = request.json
        print("Received update request:", data)  # Check to make sure it works

        cursor.execute("SELECT * FROM profiles ORDER BY id ASC LIMIT 1")
        currentProfile = cursor.fetchone()

        # Ensure we do not lose data during update
        name = data.get("name", currentProfile["name"])
        birthday = data.get("birthday", currentProfile["birthday"])
        relationship = data.get("relationship", currentProfile["relationship"])
        so = data.get("so", currentProfile["so"])
        notes = data.get("notes", currentProfile["notes"])
        gifts = data.get("gifts", currentProfile["gifts"])

        # send query to DB
        cursor.execute("""
            UPDATE profiles 
            SET name = ?, birthday = ?, relationship = ?, so = ?, notes = ?, gifts = ? 
            WHERE id = (SELECT id FROM profiles ORDER BY id ASC LIMIT 1)
        """, (name, birthday, relationship, so, notes, gifts))

        conn.commit()
        conn.close()

        return jsonify({"message": "Profile updated successfully", "updatedProfile": data})


@app.errorhandler(500)
def handle_500_error(error):
    return jsonify({"error": "Internal Server Error"}), 500



if __name__ == "__main__":
  app.run(debug=True)
