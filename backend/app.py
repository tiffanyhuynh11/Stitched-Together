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
# /my-stitches - get all friend profiles from the db, exclude the user's COMPLETE
# /friend - add number or something to the url, use the auto incremented id? Or name? Grab the 1 friend profile and allow edits (get and post)
# /new-friend - post input from frontend into db as new profile COMPLETE
# /calendar - get birthdays and names for each profile (user included) should be able to link to their indiv friend page 


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
            WHERE id = 1
        """, (name, birthday, relationship, so, notes, gifts))

        conn.commit()
        cursor.execute("SELECT * FROM profiles WHERE id = 1")
        updated = cursor.fetchone()
        conn.close()

        return jsonify(dict(updated)), 200

@app.route("/my-stitches")
def getStitches():
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch profile data
  cursor.execute("SELECT * from profiles WHERE id != 1") # exclude the user's data
  profiles = cursor.fetchall()

  conn.close()
  return jsonify([dict(profile) for profile in profiles])

@app.route("/friend/<int:friend_id>", methods=['GET', 'POST', 'DELETE'])
def getFriend(friend_id):
  conn = get_db_connection()
  cursor = conn.cursor()
  # fetch friend data
  friend = cursor.execute("SELECT * FROM profiles WHERE id = ?", (friend_id,)).fetchone()
  if not friend:
    return jsonify({'error': 'Friend not found'}), 404

  if request.method == 'GET':
    conn.close()
    return jsonify(dict(friend))  # Send friend data
    

  elif request.method == 'POST':
    data = request.json

    # ensure no loss of data
    name = data.get("name", friend["name"])
    birthday = data.get("birthday", friend["birthday"])
    relationship = data.get("relationship", friend["relationship"])
    so = data.get("so", friend["so"])
    notes = data.get("notes", friend["notes"])
    gifts = data.get("gifts", friend["gifts"])

    cursor.execute("""
            UPDATE profiles 
            SET name = ?, birthday = ?, relationship = ?, so = ?, notes = ?, gifts = ? 
            WHERE id = ?
        """, (name, birthday, relationship, so, notes, gifts, friend_id))   # update the db

    conn.commit()
    conn.close()

    return jsonify({"message": "Friend updated successfully", "updatedFriend": data})

  elif request.method == 'DELETE':
    cursor.execute("DELETE FROM profiles WHERE id=?", (friend_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Friend {friend_id} deleted successfully"})

  
  


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
