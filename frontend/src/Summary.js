import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

const Summary = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Initial State (starts at 0)
    const [wasteTotals, setWasteTotals] = useState([
        { id: 'plastic', label: 'Plastic', amount: 0 },
        { id: 'paper', label: 'Paper', amount: 0 },
        { id: 'glass', label: 'Glass', amount: 0 },
        { id: 'food', label: 'Food', amount: 0 },
        { id: 'clothes', label: 'Clothes', amount: 0 },
        { id: 'shoes', label: 'Shoes', amount: 0 },
        { id: 'mixed trash', label: 'Mixed Trash', amount: 0 },
    ]);

    // 2. The Fetch Logic (This is what talks to Flask!)
    useEffect(() => {
        const fetchSummary = async () => {
            const userEmail = localStorage.getItem('savedEmail');
            if (!userEmail) {
                console.log("No user email found in localStorage!");
                return;
            }

            try {
                // Calls the Flask @app.route('/summary') you just made
                const response = await fetch(`${process.env.REACT_APP_API_URL}/summary?email=${userEmail}`);
                
                if (response.ok) {
                    const dbData = await response.json();
                    console.log("Data from Flask:", dbData); // This will print in your browser console!
                    
                    // Match the database numbers to our React list
                    setWasteTotals(prevTotals => 
                        prevTotals.map(item => {
                            const match = dbData.find(d => d.type?.toLowerCase() === item.label.toLowerCase());
                            return {
                                ...item,
                                amount: match ? match.weight : 0 
                            };
                        })
                    );
                } else {
                    console.error("Flask returned an error status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching summary from Flask:", error);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* Header (Perfectly centered, two lines, no overlap) */}
            <div className="page-header" style={{ padding: '20px 20px 10px 20px', display: 'flex', alignItems: 'center' }}>
                <Menu 
                    size={32} 
                    style={{ cursor: 'pointer', strokeWidth: 2.5, flexShrink: 0 }} 
                    onClick={() => setIsSidebarOpen(true)} 
                />
                
                {/* This wrapper automatically centers the text and balances the menu icon! */}
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', paddingRight: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textAlign: 'center'}}>
                        Summary of Waste Types Gathered
                    </h3>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, padding: '20px 30px', overflowY: 'auto', marginTop: '10px' }}>

                {/* We map through our array to generate the perfectly styled list! */}
                {wasteTotals.map((item) => (
                    <div 
                        key={item.id} 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            backgroundColor: '#64d493', // The exact nice green from mockup
                            padding: '15px 20px', 
                            borderRadius: '12px', 
                            marginBottom: '16px',
                            fontWeight: 600,
                            color: '#111',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <span>{item.label}</span>
                        
                        {/* The grey "kg" pill badge on the right */}
                        <div style={{ 
                            backgroundColor: '#91acc8', 
                            padding: '5px 15px', 
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ 
                                minWidth: '20px', 
                                textAlign: 'right' }}>
                                {Number(item.amount).toFixed(1)}
                            </span>
                            <span>kg</span>
                        </div>
                    </div>
                ))}

            </div>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <HomeIcon size={26} strokeWidth={2.5} />
                    <span>Home</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={26} strokeWidth={2.5} />
                    <span>Dashboard</span>
                </div>
                <div className="nav-item" style={{ position: 'relative' }} onClick={() => navigate('/notifications')}>
                    <Bell size={26} strokeWidth={2.5} />
                    <div className="badge">0</div>
                    <span>Notification</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={26} strokeWidth={2.5} />
                    <span>Profile</span>
                </div>
            </div>

        </div>
    );
};

export default Summary;