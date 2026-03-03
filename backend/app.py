from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS #Cross-Origin Resource Sharing

app = Flask(__name__)
CORS(app) #this allows frontend to talk to backend

@app.route("/")
def home():
    return "WasteTrack backend running with DB"

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"message": "Email and password required"}), 400

    email = data.get("email")
    password_candidate = data.get("password")

    try:
        # ---> FIX: Use fresh connection to avoid reading stale "ghost" data!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1", port=3306, user="root", password="MySQL#2026", database="wastetrack"
        )
        cursor = fresh_db.cursor()
        query = "SELECT id, name, password FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone() 
        
        cursor.close()
        fresh_db.close()

        if user:
            stored_password = user[2]
            if stored_password == password_candidate:
                return jsonify({
                    "message": "Login successful!",
                    "user": {"id": user[0], "name": user[1]}
                }), 200
        
        return jsonify({"message": "Invalid email or password"}), 401

    except Exception as err:
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
        return jsonify({"message": "All fields are required"}), 400

    try:
        # ---> FIX: Use fresh connection for flawless saving
        fresh_db = mysql.connector.connect(
            host="127.0.0.1", port=3306, user="root", password="MySQL#2026", database="wastetrack"
        )
        cursor = fresh_db.cursor()
        
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            fresh_db.close()
            return jsonify({"message": "Email already registered"}), 400

        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, password))
        fresh_db.commit()
        
        cursor.close()
        fresh_db.close()
        
        return jsonify({"message": "Registration successful"}), 201

    except Exception as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    
@app.route('/forgot-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    try:
        # ---> FIX: Fresh connection to prevent 500 server crashes!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1", port=3306, user="root", password="MySQL#2026", database="wastetrack"
        )
        cursor = fresh_db.cursor()
        
        query = "UPDATE users SET password = %s WHERE email = %s"
        cursor.execute(query, (new_password, email))
        fresh_db.commit()

        row_count = cursor.rowcount
        cursor.close()
        fresh_db.close()

        if row_count == 0:
            return jsonify({"message": "No account found with that email."}), 404

        return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        return jsonify({"message": "Database error: " + str(e)}), 500

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    
    # The original email is used to find the correct user in the database
    original_email = data.get('original_email') 
    field_to_update = data.get('field') # This will be 'name', 'email', or 'password'
    new_value = data.get('value')

    # Security check to ensure only valid columns can be changed
    allowed_fields = ['name', 'email', 'password']
    if field_to_update not in allowed_fields:
        return jsonify({"message": "Invalid field update requested."}), 400

    try:
        # ---> FIX: Use the fresh connection method!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1",
            port=3306, 
            user="root",
            password="MySQL#2026",
            database="wastetrack"
        )
        cursor = fresh_db.cursor(buffered=True)
        
        # Dynamically updates the specific column that was edited
        query = f"UPDATE users SET {field_to_update} = %s WHERE email = %s"
        cursor.execute(query, (new_value, original_email))
        fresh_db.commit()
        
        cursor.close()
        fresh_db.close()

        return jsonify({"message": f"Your {field_to_update} was updated successfully!"}), 200

    except Exception as e:
        print(f"MYSQL ERROR: {e}")
        return jsonify({"message": "Database error: " + str(e)}), 500

@app.route('/log-waste', methods=['POST'])
def log_waste():
    data = request.get_json(force=True, silent=True)
    
    print("\n--- NEW WASTE LOG REQUEST ---")
    print(f"1. Data received: {data}")
    
    email = data.get('email')
    waste_type = data.get('waste_type')
    weight = data.get('weight')

    if not email or not waste_type or not weight:
        return jsonify({"message": "Missing data. Please check your inputs."}), 400

    try:
        # ---> FIX: Open a brand new, fresh connection specifically for this save!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1",   # <-- Use this exact IP instead of 'localhost'
            port=3306,          # <-- Change this if Workbench showed a different number!
            user="root",
            password="MySQL#2026", 
            database="wastetrack"
        )
        
        cursor = fresh_db.cursor(buffered=True)
        query = "INSERT INTO wastetrack.waste_logs (email, waste_type, weight) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, waste_type, weight))
        
        # Save it and immediately close the doors
        fresh_db.commit()
        print(f"3. SUCCESS! Rows added to database: {cursor.rowcount}")

        cursor.close()
        fresh_db.close() # Clean up the connection

        return jsonify({"message": "Waste logged successfully!"}), 201

    except Exception as e:
        print(f"MYSQL ERROR: {e}")
        return jsonify({"message": "Database error: " + str(e)}), 500

@app.route('/dashboard-stats/<email>', methods=['GET'])
def get_dashboard_stats(email):
    try:
        fresh_db = mysql.connector.connect(
            host="127.0.0.1",
            port=3306, 
            user="root",
            password="MySQL#2026",
            database="wastetrack"
        )
        cursor = fresh_db.cursor(dictionary=True) 
        
        # 1. Get TOTAL ITEMS and TOTAL WEIGHT in one swoop
        cursor.execute("SELECT COUNT(id) AS total_items, SUM(weight) AS total_weight FROM wastetrack.waste_logs WHERE email = %s", (email,))
        result = cursor.fetchone()
        
        total_items = result['total_items'] if result['total_items'] else 0
        total_weight = result['total_weight'] if result['total_weight'] else 0

        # 2. Calculate percentages (For now, assuming General/Food is non-solid, everything else is solid)
        cursor.execute("SELECT SUM(weight) AS solid_weight FROM wastetrack.waste_logs WHERE email = %s AND waste_type NOT LIKE '%General%' AND waste_type NOT LIKE '%Food%'", (email,))
        solid_res = cursor.fetchone()
        solid_weight = solid_res['solid_weight'] if solid_res['solid_weight'] else 0

        if total_weight > 0:
            solid_percent = round((solid_weight / total_weight) * 100)
            non_solid_percent = 100 - solid_percent
        else:
            solid_percent = 0
            non_solid_percent = 0

        cursor.close()
        fresh_db.close()

        # Send a perfectly formatted package back to React
        return jsonify({
            "totalItems": total_items,
            "totalWeight": round(total_weight, 2),
            "solidPercent": solid_percent,
            "nonSolidPercent": non_solid_percent
        }), 200

    except Exception as e:
        print(f"MYSQL ERROR: {e}")
        return jsonify({"message": "Database error: " + str(e)}), 500

from flask import request, jsonify
from PIL import Image
import numpy as np
# Import TensorFlow class (adjust the import path if needed)
from image_classifier import WasteClassifier 

# 1. Initialize your model globally so it doesn't reload on every single click
# (Assuming you have saved your trained weights to a file like 'waste_model.h5')
ai_classifier = WasteClassifier(num_classes=5)
# ai_classifier.model.load_weights('waste_model.h5') # UNCOMMENT THIS once you train and save your model!

# The exact order of classes your model was trained on
CLASS_NAMES = ['Plastic', 'Paper', 'Glass', 'Metal', 'General'] 

@app.route('/api/recognize', methods=['POST'])
def recognize_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found'}), 400

    file = request.files['image']
    
    try:
        # 2. Read the image straight from memory (no need to save it to your computer)
        img = Image.open(file.stream).convert('RGB')
        
        # 3. Resize to 224x224 to match your CNN's input_shape!
        img = img.resize((224, 224))
        
        # 4. Convert to an array and normalize the pixels (0 to 1) just like your training data
        img_array = np.array(img) / 255.0
        
        # TensorFlow expects a batch of images, so we add an extra dimension: (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        # 5. Make the prediction!
        predictions = ai_classifier.model.predict(img_array)
        
        # 6. Find the highest probability
        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100 # Convert to percentage
        
        predicted_tag = CLASS_NAMES[predicted_index]

        return jsonify({
            'tag': predicted_tag,
            'accuracy': round(confidence, 1) # e.g., 94.2
        }), 200

    except Exception as e:
        print("Error analyzing image:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/summary', methods=['GET'])
def get_summary():
    # 1. Grab the email from the React URL request
    email = request.args.get('email')
    
    if not email:
        return jsonify({'error': 'Email parameter is missing'}), 400

    try:
        # ---> FIX: Open a fresh connection just like your dashboard route!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1",
            port=3306, 
            user="root",
            password="MySQL#2026",
            database="wastetrack"
        )
        
        cur = fresh_db.cursor()
        
        # 2. The Magic SQL Query (using your exact table name)
        query = """
            SELECT waste_type, SUM(weight) as total_weight
            FROM wastetrack.waste_logs
            WHERE email = %s
            GROUP BY waste_type
        """
        
        cur.execute(query, (email,))
        results = cur.fetchall()
        
        # Always close your connections!
        cur.close()
        fresh_db.close()

        # 3. Format the results into a clean list for React
        summary_data = []
        for row in results:
            summary_data.append({
                'waste_type': row[0],  # e.g., 'Plastic'
                # row[1] holds the sum. We add a fallback to 0 just in case the DB returns None
                'total_weight': round(float(row[1]), 2) if row[1] else 0 
            })

        # 4. Ship it back to React!
        return jsonify(summary_data), 200

    except Exception as e:
        print(f"Error fetching summary: {e}")
        return jsonify({'error': 'Failed to fetch summary data'}), 500

@app.route('/reminders', methods=['POST'])
def save_reminder():
    # 1. Parse incoming JSON
    data = request.get_json(force=True, silent=True)
    if not data:
         return jsonify({"message": "Invalid format."}), 400

    email = data.get("email")
    date = data.get("date")
    time = data.get("time")
    # location = data.get("location")  # ---> Save this for later! 
    waste_type = data.get("wasteType")
    amount = data.get("amount")
    notes = data.get("notes")
    
    if amount == "":
        amount = None
        
    # 2. Basic Validation to Ensure Required Fields Exist
    if not email or not date or not time or not waste_type:
        return jsonify({"message": "Date, Time, and Waste Type are required fields."}), 400
        
    try:
        # 3. Use your fresh connection!
        fresh_db = mysql.connector.connect(
            host="127.0.0.1", port=3306, user="root", password="MySQL#2026", database="wastetrack"
        )
        cursor = fresh_db.cursor()
        
        # 4. Insert into the database. 
        # (Make sure to run your SQL create table query beforehand!)
        sql = """
            INSERT INTO reminders (email, reminder_date, reminder_time, waste_type, amount, notes) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (email, date, time, waste_type, amount, notes))
        fresh_db.commit()

        cursor.close()
        fresh_db.close()
        
        return jsonify({"message": "Reminder created successfully!"}), 201

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": f"Database error: {e}"}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)