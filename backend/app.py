from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS #Cross-Origin Resource Sharing

app = Flask(__name__)
CORS(app) #this allows frontend to talk to backend

# 🔗 Database connection
db = mysql.connector.connect(
    host="127.0.0.1",   # <-- Use this exact IP instead of 'localhost'
    port=3306,          # <-- Change this if Workbench showed a different number!
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
        cursor = db.cursor()
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
        cursor = db.cursor()
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
    
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    try:
        cursor = db.cursor()
        
        # 1. Update the password where the email matches
        query = "UPDATE users SET password = %s WHERE email = %s"
        cursor.execute(query, (new_password, email))
        db.commit()

        # 2. Check if an account was actually found and updated
        if cursor.rowcount == 0:
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
        cursor = db.cursor(buffered=True)
        
        # Dynamically updates the specific column that was edited
        query = f"UPDATE users SET {field_to_update} = %s WHERE email = %s"
        cursor.execute(query, (new_value, original_email))
        db.commit()
        cursor.close()

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
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)