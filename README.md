# ♻️ WasteTrack
**WasteTrack** is a web-based waste management platform developed for my final-year project at **UOW Malaysia**. 
It aims to streamline registration and tracking for environmental initiatives.

## 🚀 Features
* **User Authentication**: Secure registration and login routes.
* **Database Integration**: Persistent storage using **MySQL**.
* **Full-Stack Architecture**: Flask (Python) backend with a React frontend.

## 🛠️ Tech Stack
* **Frontend**: React.js
* **Backend**: Flask (Python)
* **Database**: MySQL
* **Testing**: Thunder Client (VS Code)

## ⚙️ Installation & Setup
Prerequisities: Please ensure you have Python 3.x, Node.js, MySQL server, and MySQL Workbench installed on your laptop device.

1. **Backend**:
   - Navigate to `/backend`
   - Install dependencies: `pip install flask mysql-connector-python flask-cors`
   - Run the server: `python app.py`

2. **Frontend**:
   - Navigate to `/frontend`
   - Install dependencies: `npm install`
   - Start React: `npm start`

3. **Database Setup (MySQL)**
   - Open MySQL Workbench and log in to your local server.

   - Create a new database for the system by running the following query:
    CREATE DATABASE wastetrack_db;

   - Import the provided database schema:

   - Go to Server > Data Import.

   - Select Import from Self-Contained File and choose the wastetrack_schema.sql file located in the root folder.

   - Select wastetrack_db as the Default Target Schema and click Start Import.

   - Configure Credentials: Navigate to the /backend folder and open app.py (or your database config file). Locate the MySQL connection settings and update the          password field to match your local MySQL root password.
