import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

// Helper component to handle the conditional navigation
function Navigation() {
  const location = useLocation();

  // Only show the navigation if the current path is exactly "/"
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <nav style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #ccc' }}>
      <Link to="/register" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
        Register
      </Link>
      <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>
        Login
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
        
        <Routes>
          <Route path="/" element={<h1>Welcome to WasteTrack! Please Register or Login.</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* The Navigation logic is now moved into its own component */}
        <Navigation />

      </div>
    </Router>
  );
}

export default App;