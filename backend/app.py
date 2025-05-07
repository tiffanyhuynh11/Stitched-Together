from http.client import CannotSendRequest
from flask import Flask, jsonify, render_template, request, url_for, flash, redirect
import sqlite3
from werkzeug.exceptions import abort

# connect to database
# taken from Dr.Lee's Colab
def get_db_connection():
    conn = sqlite3.connect('data/database.db')
    conn.row_factory = sqlite3.Row
    return conn

# insert new profile into the db
# unnecessary helper function, ran out of time to delete
def add_profile(name, birthday, relationship, connection, so, notes, gifts):
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("INSERT INTO profiles (name, birthday, relationship, connection, so, notes, gifts) VALUES (?, ?, ?, ?, ?, ?, ?)",
                 (name, birthday, relationship, connection, so, notes, gifts))

  conn.commit()
  conn.close()


app = Flask(__name__)

# route for displaying and editing the User's profile
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
            # send data from db back to the frontend
            return jsonify(dict(profile))
        return jsonify({"error": "Profile not found"}), 404

  # edit User's profile
  elif request.method == 'POST':
        data = request.json

        cursor.execute("SELECT * FROM profiles ORDER BY id ASC LIMIT 1")
        currentProfile = cursor.fetchone()

        # Ensure we do not lose data during update
        # either use current data if no new data is provided
        name = data.get("name", currentProfile["name"])
        birthday = data.get("birthday", currentProfile["birthday"])
        relationship = data.get("relationship", currentProfile["relationship"])
        so = data.get("so", currentProfile["so"])
        notes = data.get("notes", currentProfile["notes"])
        gifts = data.get("gifts", currentProfile["gifts"])

        # send query to DB
        # user does not have connection section, that is left empty
        cursor.execute("""
            UPDATE profiles 
            SET name = ?, birthday = ?, relationship = ?, so = ?, notes = ?, gifts = ? 
            WHERE id = 1
        """, (name, birthday, relationship, so, notes, gifts))

        conn.commit()

        # give the updated profile data back to the frontend
        cursor.execute("SELECT * FROM profiles WHERE id = 1")
        updated = cursor.fetchone()
        conn.close()

        return jsonify(dict(updated)), 200

# route for displaying all friends
@app.route("/my-stitches")
def getStitches():
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch all friend data
  cursor.execute("SELECT * from profiles WHERE id != 1") # exclude the user's data
  profiles = cursor.fetchall()

  conn.close()

  # send data to the frontend
  return jsonify([dict(profile) for profile in profiles])

# route for displaying, editing, and deleting individual friend data
@app.route("/friend/<int:friend_id>", methods=['GET', 'POST', 'DELETE'])
def handleFriend(friend_id):
  conn = get_db_connection()
  cursor = conn.cursor()

  # fetch friend data
  friend = cursor.execute("SELECT * FROM profiles WHERE id = ?", (friend_id,)).fetchone()

  if not friend:
    return jsonify({'error': 'Friend not found'}), 404

  # Send friend data
  if request.method == 'GET':
    conn.close()
    return jsonify(dict(friend))  
    
  # edit friend data
  elif request.method == 'POST':
    data = request.json

    # ensure no loss of data
    name = data.get("name", friend["name"])
    birthday = data.get("birthday", friend["birthday"])
    relationship = data.get("relationship", friend["relationship"])
    connection = data.get("connection", friend["connection"])
    so = data.get("so", friend["so"])
    notes = data.get("notes", friend["notes"])
    gifts = data.get("gifts", friend["gifts"])

    cursor.execute("""
    UPDATE profiles
    SET 
        name = ?, 
        birthday = ?, 
        relationship = CASE 
            WHEN relationship IS NULL THEN ? 
            ELSE relationship || ', ' || ? 
        END, 
        connection = ?,
        so = ?, 
        notes = ?, 
        gifts = ? 
    WHERE id = ?
    """, (name, birthday, relationship, relationship, connection, so, notes, gifts, friend_id)) # update the db
    # makes relationships into csv

    conn.commit()
    conn.close()

    return jsonify({"message": "Friend updated successfully", "updatedFriend": data})

  # delete friend data
  elif request.method == 'DELETE':
    cursor.execute("DELETE FROM profiles WHERE id=?", (friend_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Friend {friend_id} deleted successfully"})

# route for adding a new friend to the db
@app.route("/new-friend", methods=["POST"])
def newFriend():
  data = request.get_json()

  # Ensure that db receives valid data
  if not data or "name" not in data:
    return jsonify({"error": "Invalid request: Name is required"}), 400  

  # use add_profile() to insert into db 
  # unnecessary helper function, ran out of time to delete
  add_profile(data["name"], data["birthday"], data["relationship"], data["connection"], data["so"], data["notes"], data["gifts"])
  return jsonify({"message": "Friend Added", "friendProfile": data})

if __name__ == "__main__":
  app.run(debug=True)
