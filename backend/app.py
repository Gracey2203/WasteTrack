from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS #Cross-Origin Resource Sharing

app = Flask(__name__)
CORS(app) #this allows fronetned to talk to backend

# 🔗 Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="MySQL#2026",
    database="wastetrack"
)

cursor = db.cursor()

@app.route("/")
def home():
    return "WasteTrack backend running with DB"

@app.route("/login", methods=["POST"])
def login():
    # Thunder Client sends clean JSON, but force=True is a good safety net
    data = request.get_json(force=True, silent=True)
    
    if not data:
        return jsonify({"message": "Email and password required"}), 400

    email = data.get("email")
    password_candidate = data.get("password")

    # 1. Look up the user by email
    try:
        query = "SELECT id, name, password FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone() # returns a tuple: (id, name, hashed_password)

        if user:
            # 2. Compare the stored hash with what the user just typed
            stored_password_hash = user[2]
            
            if stored_password_hash == password_candidate:
                return jsonify({
                    "message": "Login successful!",
                    "user": {"id": user[0], "name": user[1]}
                }), 200
        
        # 3. If user not found OR password doesn't match
        return jsonify({"message": "Invalid email or password"}), 401

    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True, silent=True)
    
    if not data:
        return jsonify({"message": "Invalid JSON format or empty body"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields (name, email, password) are required"}), 400

    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"message": "Email already registered"}), 400

        # Insert new user
        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, password))
        db.commit()
        
        return jsonify({"message": "Registration successful"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)