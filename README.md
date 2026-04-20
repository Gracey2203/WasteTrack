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

Prerequisites: Please ensure you have Python 3.x, Node.js, MySQL Server, and MySQL Workbench installed on your device. Extract the submitted project folder and open the root directory in your terminal.

1. Database Setup (MySQL)

    - Open MySQL Workbench and log in to your local server.

- Create a new database by running the following query: CREATE DATABASE wastetrack_db;

- Import the provided database schema:

- Go to Server > Data Import.

- Select Import from Self-Contained File and choose the wastetrack_schema.sql file located in the root folder.

- Select wastetrack_db as the Default Target Schema and click Start Import.

- Configure Credentials: Navigate to the /backend folder and open app.py. Locate the MySQL connection settings and update the password field to match your local MySQL root password.

2. Backend Setup (Flask API)

- Open a new terminal and navigate to the backend directory: cd backend

- Create and activate a virtual environment (Recommended):

- Windows: python -m venv venv then venv\Scripts\activate

- Mac/Linux: python3 -m venv venv then source venv/bin/activate

- Install dependencies: pip install flask mysql-connector-python flask-cors tensorflow (Note: Add any other libraries like Pillow or numpy here if you used them!)

- Run the server: python app.py

- The backend API will now be running on http://127.0.0.1:5000

3. Frontend Setup (React.js)

- Open a second terminal and navigate to the frontend directory: cd frontend

- Install dependencies: npm install

- Start the React application: npm start

4. Accessing the System

- The WasteTrack web application will automatically open in your default browser. If it does not, manually navigate to http://localhost:3000.
