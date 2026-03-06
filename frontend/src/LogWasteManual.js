import React, { useState } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts'; 

const LogWasteManual = () => { 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');

    // Modal States
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Carbon Impact States
    const [hasCalculated, setHasCalculated] = useState(false);
    const [impactStats, setImpactStats] = useState({
        saved: 50, emitted: 50, plastic: 0, paper: 0, glass: 0, general: 0
    });

    const carbonColors = ['#3B82F6', '#BFDBFE'];
    const dynamicCarbonData = [
        { name: 'Carbon Saved', value: impactStats.saved },
        { name: 'Carbon Emitted', value: impactStats.emitted }
    ];

    // --- Handlers ---

    // 1. User clicks Calculate
    const handleCalculate = () => {
        if (!wasteType || !amount) {
            alert("Please select a waste type and enter an amount!");
            return;
        }

        // Check if the selected waste falls under the 'General' umbrella
        const isGeneral = ['Ceramics', 'Food', 'Styrofoam', 'Diapers'].includes(wasteType);

        // Update Carbon Impact States
        setImpactStats({
            saved: Math.min(Math.round(amount * 12), 100), 
            emitted: Math.max(100 - Math.round(amount * 12), 0),
            plastic: wasteType === 'Plastic' ? 80 : 0, 
            paper: wasteType === 'Paper' ? 80 : 0,
            glass: wasteType === 'Glass' ? 80 : 0,
            general: isGeneral ? 80 : 0  // If it's one of the 4 new items, fill the General bar!
        });
        
        setHasCalculated(true);
    };

    // 2. User clicks the main submit button
    const handleInitialSubmit = () => {
        if (!wasteType || !amount) {
            alert("Please select a waste type and enter an amount.");
            return;
        }
        if (!hasCalculated) {
            alert("Please click Calculate below to see your Carbon Impact first!");
            return;
        }
        setShowConfirm(true); 
    };

    // 3. User clicks "Yes" on the confirm modal
    const handleConfirmYes = async () => {
        setShowConfirm(false); 
        
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

            if (response.ok) {
                setShowSuccess(true); 
                setWasteType(''); 
                setAmount('');
                setHasCalculated(false);
                // Reset bars to 0 after success
                setImpactStats({ saved: 50, emitted: 50, plastic: 0, paper: 0, glass: 0, general: 0 });
            } else {
                const errorData = await response.json();
                alert(`Backend Error: ${errorData.message}`);
            }
            
        } catch (error) {
            console.error("Error saving waste:", error);
            alert("Network Error: Could not reach the Flask server. Is it running?");
        }
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--light-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
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
                        <button className="close-x" onClick={() => {
                            setShowSuccess(false);
                            navigate('/dashboard');
                        }}>×</button>
                        <h2 style={{ marginTop: '10px', marginBottom: '20px' }}>
                            You've successfully saved your waste to your dashboard!
                        </h2>
                        <button className="modal-btn" onClick={() => {
                            setShowSuccess(false);
                            navigate('/dashboard');
                        }}>View Dashboard</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="page-header" style={{ paddingBottom: '0' }}>
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                <h1 className="page-title">Log Waste Manually</h1> 
            </div>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, padding: '20px 30px', overflowY: 'auto' }}>
                
                {/* Section 1: Dropdown */}
                <h3 className="waste-section-title">Select a waste type:</h3>
                <select 
                    value={wasteType} 
                    onChange={(e) => {
                        setWasteType(e.target.value);
                        setHasCalculated(false);
                    }}
                    className="waste-input-green"
                    style={{ marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #64d493', width: '100%' }}
                >
                    <option value="" disabled>Choose waste type</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="Ceramics">Ceramics</option>
                    <option value="Food">Food</option>
                    <option value="Styrofoam">Styrofoam</option>
                    <option value="Diapers">Diapers</option>
                </select>

                {/* Section 2: Input Card */}
                <h3 className="waste-section-title">Enter amount of waste (kg):</h3>
                <div className="waste-card">
                    <input 
                        type="number" 
                        min="0"
                        placeholder="Amount" 
                        className="waste-input-green"
                        value={amount}
                        onChange={(e) => {
                            if (e.target.value >= 0 || e.target.value === '') {
                                setAmount(e.target.value);
                                setHasCalculated(false);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <button className="waste-submit-btn" onClick={handleInitialSubmit}>Submit</button>
                </div>
                
                {/* --- THE SMART REMINDER --- */}
                {wasteType && amount && !hasCalculated && (
                    <div style={{ marginBottom: '15px', fontSize: '0.85rem', color: '#000000', backgroundColor: '#64d493', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                        <b>Tip:</b> Click <b>Calculate</b> on the Carbon Impact card below to unlock the Submit button!
                    </div>
                )}

                {/* Section 3: Dynamic Carbon Impact Card */}
                <div className="carbon-chart-section" style={{ padding: '15px', borderRadius: '12px', backgroundColor: '#91acc8', marginTop: '20px' }}>
                    
                    {/* Header (Title Centered, Calculate Pinned to Right) */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                            Carbon Impact
                        </h3>
                        <span 
                            style={{ position: 'absolute', right: 0, fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', color: '#111' }} 
                            onClick={handleCalculate}
                        >
                            Calculate
                        </span>
                    </div>

                    {/* Dynamic Recharts Pie Chart */}
                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '160px', alignItems: 'center', marginBottom: '30px' }}>
                        <PieChart width={160} height={160}>
                            <Pie data={dynamicCarbonData} cx="50%" cy="50%" outerRadius={80} paddingAngle={1} dataKey="value" stroke="none">
                                {dynamicCarbonData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={carbonColors[index % carbonColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </div>

                    {/* Dynamic Progress Bars */}
                    <div className="impact-bar-row">
                        <div className="impact-label">Plastic</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: `${impactStats.plastic}%` }}></div></div>
                        <div className="impact-percent">{impactStats.plastic}%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">Paper</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: `${impactStats.paper}%` }}></div></div>
                        <div className="impact-percent">{impactStats.paper}%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">Glass</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: `${impactStats.glass}%` }}></div></div>
                        <div className="impact-percent">{impactStats.glass}%</div>
                    </div>
                    <div className="impact-bar-row">
                        <div className="impact-label">General</div>
                        <div className="impact-track"><div className="impact-fill" style={{ width: `${impactStats.general}%` }}></div></div>
                        <div className="impact-percent">{impactStats.general}%</div>
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