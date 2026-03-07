import React, { useState } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';//cell is for coloring the pie chart slices

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
    const [impactStats, setImpactStats] = useState({
        saved: 50,
        emitted: 50,
        plastic: 0,
        paper: 0,
        glass: 0,
        general: 0
    });

    // The logic that runs when "Calculate" is clicked
    const handleCalculate = () => {
        if (!wasteType || !amount) {
            alert("Please select a waste type and enter an amount first to calculate its impact!");
            return;
        }
        
        const weight = parseFloat(amount);
        
        // A simple formula to make the bars move dynamically based on input!
        setImpactStats({
            saved: Math.min(Math.round(weight * 12), 100), // The more waste they log, the more they "save" from landfill (up to 100%)
            emitted: Math.max(100 - Math.round(weight * 12), 0),// The more waste they log, the more they "emit" (up to 100%)
            // Boosts the specific bar of the waste type they selected
            plastic: wasteType === 'Plastic' ? Math.min(Math.round(weight * 20), 100) : 15,// Plastic has a higher multiplier since it's more harmful
            paper: wasteType === 'Paper' ? Math.min(Math.round(weight * 20), 100) : 10,// Paper has a moderate multiplier
            glass: wasteType === 'Glass' ? Math.min(Math.round(weight * 20), 100) : 5,// Glass has a lower multiplier since it's less harmful than plastic and paper
            general: wasteType === 'General' ? Math.min(Math.round(weight * 20), 100) : 2// General waste has the lowest multiplier since it includes less harmful items like food waste, which can decompose and even enrich soil, and styrofoam, which is harmful but often used in small amounts.
        });
    };

    // Link the pie chart data to our new dynamic state
    const dynamicCarbonData = [
        { name: 'Carbon Saved', value: impactStats.saved },
        { name: 'Carbon Emitted', value: impactStats.emitted }
    ];

    // 1. User clicks the main submit button
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

    // Using a nice blue/light-blue combo for Carbon/Air
    const carbonColors = ['#3B82F6', '#d5e8ee'];

    const [hasCalculated, setHasCalculated] = useState(false);
 
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
            <div style={{ flexGrow: 1, padding: '20px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '25px', justifyContent: 'flex-start' }}>
                
                {/* Section 1: Dropdown */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="waste-section-title" style={{ margin: '0 0 10px 0' }}>Select a waste type:</h3>
                    <select 
                        className="waste-dropdown"
                        value={wasteType}
                        onChange={(e) => {
                            setWasteType(e.target.value);
                            setHasCalculated(false); 
                        }}
                    >
                        <option value="" disabled>Choose an option</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Paper">Paper</option>
                        <option value="Glass">Glass</option>
                        <option value="General">General (food, styrofoam etc.)</option>
                    </select>
                </div>

                {/* Section 2: Input Card */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="waste-section-title" style={{ margin: '0 0 10px 0' }}>Enter amount of waste (kg):</h3>
                    <div className="waste-card" style={{ margin: 0 }}>
                        <input 
                            type="number" 
                            min="0"
                            placeholder="Amount" 
                            className="waste-input-green"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setHasCalculated(false);
                            }}
                        />
                        
                        {/* The Smart Reminder Box */}
                        {!hasCalculated && wasteType && amount && (
                            <div style={{ fontSize: '0.8rem', color: '#92400E', backgroundColor: '#FEF3C7', padding: '8px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>
                                <b>Tip:</b> Scroll down and click <b>Calculate</b> to see your Carbon Impact before submitting!
                            </div>
                        )}

                        <button className="waste-submit-btn" onClick={handleInitialSubmit}>Submit</button>
                    </div>
                </div>

                {/* Section 3: Carbon Impact Card */}
                <div className="carbon-chart-section" style={{ padding: '15px', borderRadius: '12px', backgroundColor: '#91acc8' }}>
                    
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

                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '160px', alignItems: 'center', marginBottom: '20px' }}>
                        <PieChart width={160} height={160}>
                            <Pie data={dynamicCarbonData} cx="50%" cy="50%" outerRadius={80} paddingAngle={1} dataKey="value" stroke="none">
                                {dynamicCarbonData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={carbonColors[index % carbonColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </div>

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