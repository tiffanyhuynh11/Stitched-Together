from http.client import CannotSendRequest
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

# / - nothing
# /profile - get and post for editing users profile only COMPLETE
# /my-stitches - get all profiles from the db, user is the center node
# /friend - add number or something to the url, use the auto incremented id? Or name? Grab the 1 friend profile and allow edits (get and post)
# /new-friend - post input from frontend into db as new profile
# /birthdays - get birthdays and names for each profile (user included) should be able to link to their indiv friend page 


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

@app.route("/my-stitches")
def getStitches():
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch all profile data (user and friends)
  cursor.execute("SELECT * from profiles")
  profiles = cursor.fetchall()

  conn.close()
  return jsonify([dict(profile) for profile in profiles])

@app.route("/friend/<int:friend_id>")
def getFriend(friend_id):
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch friend data
  friend = cursor.execute("SELECT * FROM profiles WHERE id = ?", (friend_id,)).fetchone()

  conn.close()
  if friend:
        return jsonify(friend)  # Send friend data as JSON response
  return jsonify({'error': 'Friend not found'}), 404


@app.route("/new-friend", methods=["POST"])
def newFriend():
  data = request.get_json()

  if not data or "name" not in data:
    return jsonify({"error": "Invalid request: Name is required"}), 400  # Handle missing data

  add_profile(data["name"], data["birthday"], data["relationship"], data["so"], data["notes"], data["gifts"])
  return jsonify({"message": "Friend Added", "friendProfile": data})


@app.errorhandler(500)
def handle_500_error(error):
    return jsonify({"error": "Internal Server Error"}), 500



if __name__ == "__main__":
  app.run(debug=True)
