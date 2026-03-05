import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from PIL import Image
import numpy as np
from image_classifier import WasteClassifier 

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AI model globally
ai_classifier = WasteClassifier(num_classes=5)
# ai_classifier.model.load_weights('waste_model.h5') 

CLASS_NAMES = ['Plastic', 'Paper', 'Glass', 'Metal', 'General'] 

def get_db_connection():
    """Helper function to create a fresh DB connection using env variables."""
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password=os.getenv("DB_PASSWORD"),
        database="wastetrack"
    )

@app.route("/")
def home():
    return "WasteTrack backend running with DB"

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"message": "Invalid JSON format"}), 400

    name = data.get("name")
    email = data.get("email")
    raw_password = data.get("password")

    if not name or not email or not raw_password:
        return jsonify({"message": "All fields are required"}), 400

    hashed_password = generate_password_hash(raw_password)

    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"message": "Email already registered"}), 400

        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, hashed_password))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Registration successful"}), 201
    except Exception as err:
        return jsonify({"message": f"Database error: {err}"}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True, silent=True)
    email = data.get("email")
    password_candidate = data.get("password")

    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT id, name, password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone() 
        cursor.close()
        db.close()

        if user and check_password_hash(user[2], password_candidate):
            return jsonify({
                "message": "Login successful!",
                "user": {"id": user[0], "name": user[1]}
            }), 200
        
        return jsonify({"message": "Invalid email or password"}), 401
    except Exception as err:
        return jsonify({"message": f"Database error: {err}"}), 500

@app.route('/log-waste', methods=['POST'])
def log_waste():
    data = request.get_json(force=True, silent=True)
    email = data.get('email')
    waste_type = data.get('waste_type')
    weight = data.get('weight')

    if not email or not waste_type or not weight:
        return jsonify({"message": "Missing data."}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()
        query = "INSERT INTO waste_logs (email, waste_type, weight) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, waste_type, weight))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Waste logged successfully!"}), 201
    except Exception as e:
        return jsonify({"message": f"Database error: {e}"}), 500

@app.route('/api/recognize', methods=['POST'])
def recognize_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found'}), 400

    file = request.files['image']
    try:
        img = Image.open(file.stream).convert('RGB').resize((224, 224))
        img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
        
        predictions = ai_classifier.model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100 

        return jsonify({
            'tag': CLASS_NAMES[predicted_index],
            'accuracy': round(confidence, 1)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reminders', methods=['POST'])
def save_reminder():
    data = request.get_json(force=True, silent=True)
    email = data.get("email")
    date = data.get("date")
    time = data.get("time")
    waste_type = data.get("wasteType")
    amount = data.get("amount") or None
    notes = data.get("notes")
    
    if not email or not date or not time or not waste_type:
        return jsonify({"message": "Required fields missing."}), 400
        
    try:
        db = get_db_connection()
        cursor = db.cursor()
        sql = """
            INSERT INTO reminders (email, reminder_date, reminder_time, waste_type, amount, notes) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (email, date, time, waste_type, amount, notes))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Reminder created successfully!"}), 201
    except Exception as e:
        return jsonify({"message": f"Database error: {e}"}), 500

@app.route('/update-profile', methods=['POST', 'OPTIONS'])
def update_profile():
    # Handle CORS pre-flight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"message": "Invalid format."}), 400

    original_email = data.get("original_email")
    field = data.get("field")
    value = data.get("value")

    # Security check: only allow updating these specific columns!
    valid_fields = ["name", "email", "password"]
    if field not in valid_fields:
        return jsonify({"message": "Invalid field."}), 400

    # ---> CRITICAL SECURITY UPDATE: Hash the new password before saving it! <---
    if field == "password":
        value = generate_password_hash(value)

    try:
        # Use your new environment variable helper function!
        db = get_db_connection()
        cursor = db.cursor()
        
        # Dynamically update the specific field requested by React
        query = f"UPDATE users SET {field} = %s WHERE email = %s"
        cursor.execute(query, (value, original_email))
        db.commit()

        cursor.close()
        db.close()

        return jsonify({"message": f"Successfully updated {field}!"}), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500
    
@app.route('/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
    # Handle CORS pre-flight request from the browser
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"message": "Invalid format."}), 400

    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"message": "Email and new password are required."}), 400

    # ---> CRITICAL SECURITY UPDATE: Hash the newly created password! <---
    hashed_password = generate_password_hash(new_password)

    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        query = "UPDATE users SET password = %s WHERE email = %s"
        cursor.execute(query, (hashed_password, email))
        db.commit()

        row_count = cursor.rowcount
        cursor.close()
        db.close()

        # If row_count is 0, it means the email wasn't found in the database
        if row_count == 0:
            return jsonify({"message": "No account found with that email."}), 404

        return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500
    
@app.route('/dashboard-stats/<email>', methods=['GET', 'OPTIONS'])
def get_dashboard_stats(email):
    # Handle CORS pre-flight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        db = get_db_connection()
        cursor = db.cursor()

        # 1. Get total items (count) and total weight (sum)
        cursor.execute("SELECT COUNT(*), SUM(weight) FROM waste_logs WHERE email = %s", (email,))
        overall_stats = cursor.fetchone()

        # Handle the case where the user has no logs yet (SUM returns None)
        total_items = overall_stats[0] if overall_stats[0] else 0
        total_weight = float(overall_stats[1]) if overall_stats[1] else 0.0

        # 2. Calculate Solid vs Non-Solid Waste based on weight
        # Solid = Plastic, Paper, Glass, Metal
        # Non-solid = General (food, liquids, etc.)
        cursor.execute("""
            SELECT SUM(weight) FROM waste_logs 
            WHERE email = %s AND waste_type IN ('Plastic', 'Paper', 'Glass', 'Metal')
        """, (email,))
        solid_res = cursor.fetchone()
        
        solid_weight = float(solid_res[0]) if solid_res[0] else 0.0

        # Math to figure out the percentages for the Pie Chart
        if total_weight > 0:
            solid_percent = round((solid_weight / total_weight) * 100)
            non_solid_percent = 100 - solid_percent
        else:
            solid_percent = 0
            non_solid_percent = 0

        cursor.close()
        db.close()

        # Send the exact JSON structure your React state is looking for!
        return jsonify({
            "totalItems": total_items,
            "totalWeight": round(total_weight, 2),
            "solidPercent": solid_percent,
            "nonSolidPercent": non_solid_percent
        }), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500

@app.route('/summary', methods=['GET', 'OPTIONS'])
def get_summary():
    # Handle CORS pre-flight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    # Because it's a GET request with ?email=..., we use request.args
    email = request.args.get('email')
    
    if not email:
        return jsonify({"message": "Email is required."}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        # Group by waste_type and sum up the weights for this specific user
        cursor.execute("""
            SELECT waste_type, SUM(weight) 
            FROM waste_logs 
            WHERE email = %s 
            GROUP BY waste_type
        """, (email,))
        
        results = cursor.fetchall()
        
        # Format into a clean dictionary for React (e.g., {"Plastic": 15.2, "Paper": 2.5})
        summary_data = [{"type": row[0], "weight": float(row[1])} for row in results]

        cursor.close()
        db.close()

        return jsonify(summary_data), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500

@app.route('/api/centres', methods=['GET', 'OPTIONS'])
def get_centres():
    # Handle CORS pre-flight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        cursor.execute("SELECT id, name, type, badge, image, tags FROM recycling_centres")
        results = cursor.fetchall()
        
        centres_data = []
        for row in results:
            # We split the comma-separated string back into a Python list so React can map it!
            tag_list = row[5].split(',') if row[5] else []
            
            centres_data.append({
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "badge": row[3],
                "image": row[4],
                "tags": tag_list
            })

        cursor.close()
        db.close()

        return jsonify(centres_data), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)