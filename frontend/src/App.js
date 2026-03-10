import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import logo from './WasteTrack logo.png'; // Add your image to the src folder!
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import Dashboard from './Dashboard';
import Notifications from './Notification';
import Profile from './Profile';
import Sidebar from './Sidebar';
import Summary from './Summary';
import LogWasteManual from './LogWasteManual';
import LogWasteImage from './LogWasteImage';
import Reminders from './Reminders';
import Impact from './Impact';
import RecyclingCentres from './RecyclingCentres';
import GetStarted from './GetStarted';
import LearnMore from './LearnMore';
import Terms from './Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="mobile-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
            
            {/* 1. Actual Logo Image */}
            <img 
              src={logo} 
              alt="WasteTrack Logo" 
              style={{ width: '100px', height: '100px', marginBottom: '10px', borderRadius: '10px' }} 
            />
            
            {/* 2 & 3. Split Colors and Reduced Bottom Margin (20px) */}
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
              <span style={{ color: '#91acc8' }}>Waste</span>
              <span style={{ color: '#64d493' }}>Track</span>
            </h1>

            <Link to="/register" style={{ width: '100%', textDecoration: 'none' }}>
              <button className="green-button">Register Account</button>
            </Link>
            
            <Link to="/login" style={{ width: '100%', textDecoration: 'none' }}>
              <button className="green-button">Log In</button>
            </Link>

          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/log-waste-manual" element={<LogWasteManual />} />
        <Route path="/log-waste-image" element={<LogWasteImage />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/recycling-centres" element={<RecyclingCentres />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;