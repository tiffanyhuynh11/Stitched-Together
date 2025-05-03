from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows frontend to communicate with Flask

# Sample profile data
profiles = [
    {"id": 1, "name": "John Doe", "birthday": "1999-03-01"},
    {"id": 2, "name": "Jane Smith", "birthday": "2000-05-15"}
]

@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    return jsonify(profiles)
