import React, { useState } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

const LogWasteManual = () => { 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');

    // Modal States
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // 1. User clicks the main submit button
    const handleInitialSubmit = () => {
        if (!wasteType || !amount) {
            alert("Please select a waste type and enter an amount.");
            return;
        }
        setShowConfirm(true); // Pops open the "Ready to submit?" modal
    };

    // 2. User clicks "Yes" on the confirm modal
    const handleConfirmYes = async () => {
        setShowConfirm(false); 
        
        // Let's make absolutely sure we know who is logged in!
        const userEmail = localStorage.getItem('savedEmail');
        if (!userEmail) {
            alert("Wait! We don't know who is logged in. Please log out and log back in.");
            return;
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/log-waste`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail, 
                    waste_type: wasteType,
                    weight: parseFloat(amount)
                })
            });

            // NOW we only show success if Flask actually confirms the database saved it!
            if (response.ok) {
                setShowSuccess(true); 
                setWasteType(''); 
                setAmount('');
            } else {
                // If Flask rejects it, we pull the exact error message and show it.
                const errorData = await response.json();
                alert(`Backend Error: ${errorData.message}`);
            }
            
        } catch (error) {
            console.error("Error saving waste:", error);
            alert("Network Error: Could not reach the Flask server. Is it running?");
        }
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* MODAL 1: Confirm Submission */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Ready to submit?</h2>
                        <div className="modal-btn-row">
                            <button className="modal-btn" onClick={handleConfirmYes}>Yes</button>
                            <button className="modal-btn" onClick={() => setShowConfirm(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: Success Message */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        {/* Auto-navigates to Dashboard when they click the X */}
                        <button className="close-x" onClick={() => {
                            setShowSuccess(false);
                            navigate('/dashboard');
                        }}>×</button>
                        
                        <h2 style={{ marginTop: '10px', marginBottom: '20px' }}>
                            You've successfully saved your waste to your dashboard!
                        </h2>
                        
                        {/* Added a highly visible button to take them directly there */}
                        <button className="modal-btn" onClick={() => {
                            setShowSuccess(false);
                            navigate('/dashboard');
                        }}>View Dashboard</button>
                    </div>
                </div>
            )}

            {/* Header (Matching your mockup's clean look) */}
            <div className="page-header" style={{ paddingBottom: '0' }}>
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
            </div>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, padding: '20px 30px', overflowY: 'auto' }}>
                
                {/* Section 1: Dropdown */}
                <h3 className="waste-section-title">Select a waste type:</h3>
                <select 
                    className="waste-dropdown"
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                >
                    <option value="" disabled>Choose an option</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="General">General (food, styrofoam etc.)</option>
                </select>

                {/* Section 2: Input Card */}
                <h3 className="waste-section-title">Enter amount of waste (kg):</h3>
                <div className="waste-card">
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        className="waste-input-green"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button className="waste-submit-btn" onClick={handleInitialSubmit}>Submit</button>
                </div>

                {/* Section 3: Carbon Impact Card */}
                <div className="waste-card" style={{ padding: '20px 15px' }}>
                    <div className="impact-header">
                        <h3>Carbon Impact</h3>
                        <span>Calculate</span>
                    </div>
                    
                    <div className="pie-icon-container">
                        <PieChart size={40} strokeWidth={2} />
                    </div>

                    {/* Hardcoded bars to match the mockup design */}
                    <div className="impact-bar-row">
                        <div className="impact-label">Plastic</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: '100%' }}></div></div>
                        <div className="impact-percent">100%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">Paper</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: '50%' }}></div></div>
                        <div className="impact-percent">50%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">Glass</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: '30%' }}></div></div>
                        <div className="impact-percent">30%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">General</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: '10%' }}></div></div>
                        <div className="impact-percent">10%</div>
                    </div>
                </div>

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

export default LogWasteManual;