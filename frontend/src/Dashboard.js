import React, { useState, useEffect } from 'react';
//useState: Used to hold the user's name so it can be displayed.
//useEffect: Used to run the "look into memory" logic exactly once when the page opens.
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        // Retrieve the name from memory when the dashboard opens
        const storedName = localStorage.getItem('userName');
        
        if (storedName) {
            setName(storedName);
        } else {
            // If no name is found (someone tried to skip the login page), send them back home
            navigate('/login');
        }
    }, [navigate]);
    
    const handleLogout = () => {
        // For now, we just go back to home. Later we can clear tokens/sessions.
        localStorage.removeItem('userName'); // Clear the stored name
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>♻️ WasteTrack Dashboard</h1>
            <p>You have successfully logged in!</p>
            <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px' }}>
                {/* Now it shows the dynamic name! */}
                <h3>Welcome to your project hub, {name}!</h3>
                <p>This is where your main Enterprise Information System logic will live.</p>
            </div>
            <button 
                onClick={handleLogout} 
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', className: 'green-button' }}
            >  
                Logout
            </button>
        </div>
    );
};

export default Dashboard;