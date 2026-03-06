import React, { useState, useRef } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const LogWasteImage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // --- Image & AI States ---
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null); // The preview link
    const [imageFile, setImageFile] = useState(null);         // NEW: The actual file!
    
    const [isRecognizing, setIsRecognizing] = useState(false);
    
    // --- Modal & Result States ---
    const [showResultModal, setShowResultModal] = useState(false);
    const [aiResult, setAiResult] = useState({ tag: '', accuracy: 0 });

    // --- Carbon Impact States (Same as Manual Log) ---
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
    const handleImageClick = () => {
        fileInputRef.current.click(); // Triggers the hidden file input
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Save the physical file for Flask
            setSelectedImage(URL.createObjectURL(file)); // Save the preview for the UI
            setHasCalculated(false);
            setAiResult({ tag: '', accuracy: 0 }); // Clear old results
        }
    };

    const handleRecognizeImage = async () => {
        if (!imageFile) {
            alert("Please snap or upload a picture first!");
            return;
        }

        setIsRecognizing(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            // Send the physical image file to the AI recognition route
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recognize`, {
                method: 'POST',
                body: formData // DO NOT set Content-Type header here; the browser does it automatically for FormData!
            });

            if (response.ok) {
                const data = await response.json();
                setAiResult({ tag: data.tag, accuracy: data.accuracy });
            } else {
                alert("The AI server had trouble analyzing this image.");
            }
        } catch (error) {
            console.error("AI Error:", error);
            alert("Could not reach the AI server. Is Flask running?");
        } finally {
            setIsRecognizing(false);
        }
    };

    const handleCalculate = () => {
        if (!aiResult.tag) {
            alert("Please recognize an image first to determine the waste type!");
            return;
        }
        
        const estimatedWeight = 0.5; // Dummy weight estimation (in kg) - in a real scenario, this could also come from the AI or be user-inputted
        const wasteType = aiResult.tag; // 'Plastic', 'Paper', 'Glass', or 'General' based on AI result

        setImpactStats({
            saved: Math.min(Math.round(estimatedWeight * 12), 100), 
            emitted: Math.max(100 - Math.round(estimatedWeight * 12), 0),
            plastic: wasteType === 'Plastic' ? 80 : 15,
            paper: wasteType === 'Paper' ? 80 : 10,
            glass: wasteType === 'Glass' ? 80 : 5,
            general: wasteType === 'General' ? 80 : 2
        });
        setHasCalculated(true);
    };

    const handleSubmitToDatabase = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/log-waste`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: localStorage.getItem('savedEmail'),
                    waste_type: aiResult.tag, // Grabs the tag the AI just found!
                    weight: 0.5               // Using your estimated 0.5kg
                })
            });

            if (response.ok) {
                alert(`Successfully logged 0.5kg of ${aiResult.tag} to your dashboard!`);
                setShowResultModal(false);
                navigate('/dashboard'); // Sends them to the dashboard to see their updated stats!
            } else {
                alert("Failed to save waste log to database.");
            }
        } catch (error) {
            console.error("Database Error:", error);
            alert("Error connecting to the server.");
        }
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* Header */}
            <div className="page-header" style={{ paddingBottom: '0' }}>
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                <h1 className="page-title">Log Waste (Image)</h1> 
            </div>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, padding: '20px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '25px', justifyContent: 'flex-start' }}>
                
                {/* Section 1: Image Upload Card */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="waste-section-title" style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Snap Picture (png/jpg):</h3>
                    
                    <div className="waste-card" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        {/* Hidden File Input (capture="environment" tries to open the rear camera on mobile) */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleImageChange} 
                        />
                        
                        {/* Camera Box / Image Preview */}
                        <div 
                            onClick={handleImageClick}
                            style={{ 
                                width: '100%', height: '180px', backgroundColor: '#94A3B8', 
                                borderRadius: '12px', display: 'flex', justifyContent: 'center', 
                                alignItems: 'center', cursor: 'pointer', marginBottom: '15px',
                                overflow: 'hidden', position: 'relative'
                            }}
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Waste preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Camera size={48} color="#CBD5E1" strokeWidth={1.5} />
                            )}
                        </div>

                        <button 
                            className="waste-submit-btn" 
                            onClick={handleRecognizeImage}
                            disabled={isRecognizing}
                        >
                            {isRecognizing ? "Scanning..." : "Recognize image"}
                        </button>

                        {/* --- NEW: The AI Result & Smart Reminder --- */}
                        {aiResult.tag && !hasCalculated && (
                            <div style={{ marginTop: '15px', width: '100%', fontSize: '0.85rem', color: '#000000', backgroundColor: '#64d493', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                                <b>Identified as {aiResult.tag} ({aiResult.accuracy}%)</b><br/><br/>
                                <b>Tip:</b> Scroll down and click <b>Calculate</b> to see your Carbon Impact before submitting!
                            </div>
                        )}

                        {/* --- NEW: The Proceed Button (Appears only AFTER calculation) --- */}
                        {aiResult.tag && hasCalculated && (
                            <button 
                                className="waste-submit-btn" 
                                style={{ marginTop: '15px', backgroundColor: '#64d493' }} 
                                onClick={() => setShowResultModal(true)}
                            >
                                Proceed to Submit
                            </button>
                        )}
                    </div>
                </div>

                {/* Section 2: Carbon Impact Card (Exact match to Manual page) */}
                <div className="carbon-chart-section" style={{ padding: '15px', borderRadius: '12px', backgroundColor: '#91acc8' }}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Carbon Impact</h3>
                        <span style={{ position: 'absolute', right: 0, fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', color: '#111' }} onClick={handleCalculate}>Calculate</span>
                    </div>

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

            {/* --- AI IDENTIFICATION MODAL --- */}
            {showResultModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{ backgroundColor: '#94A3B8', padding: '25px', width: '85%' }}>
                        <button className="close-x" onClick={() => setShowResultModal(false)} style={{ color: '#000000' }}>×</button>
                        
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px' }}>Waste identified!</h2>
                        
                        <div style={{ fontSize: '1rem', marginBottom: '25px', lineHeight: '1.6' }}>
                            <p style={{ margin: 0 }}>Tags: <b>{aiResult.tag}</b></p>
                            <p style={{ margin: 0 }}>Accuracy (%): <b>{aiResult.accuracy}%</b></p>
                        </div>
                        
                        <button className="waste-submit-btn" onClick={handleSubmitToDatabase}>Submit</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LogWasteImage;