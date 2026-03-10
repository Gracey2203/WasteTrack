import React, { useState } from 'react';
import { Menu, FileText, Camera, Bell, Users, Home as HomeIcon, LayoutDashboard, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // CRITICAL FOR THE COLORS AND LAYOUT!
import Sidebar from './Sidebar';
import logo from './WasteTrack logo.png';
import plasticImg from './Plastic.png'; 
import paperImg from './Paper.png';
import glassImg from './Glass.png';
import generalImg from './General.png';

const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogWasteModal, setShowLogWasteModal] = useState(false);
    // Small pill button style
    const smallBtnStyle = {
        backgroundColor: '#64d493', color: '#000000', border: 'none',
        borderRadius: '15px', padding: '5px 15px', fontSize: '0.8rem',
        fontWeight: 'bold', cursor: 'pointer'
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--light-blue)', minHeight: '100vh' }}>
            
            {/* --- LOG WASTE MODAL --- */}
            {showLogWasteModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center' 
                }}>
                    <div style={{ 
                        backgroundColor: '#91acc8', padding: '30px 20px', 
                        borderRadius: '15px', width: '80%', maxWidth: '320px', 
                        position: 'relative', textAlign: 'center' 
                    }}>
                        {/* Close X Button */}
                        <X 
                            size={24} 
                            style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer' }} 
                            onClick={() => setShowLogWasteModal(false)} 
                        />
                        
                        <h2 style={{ margin: '0 0 25px 0', fontSize: '1.6rem', fontWeight: 'bold' }}>Log Waste</h2>
                        
                        <button 
                            style={{ 
                                backgroundColor: '#64d493', color: '#000000', border: 'none', 
                                padding: '12px', width: '100%', borderRadius: '25px', 
                                fontWeight: 'bold', fontSize: '1rem', marginBottom: '15px', cursor: 'pointer' 
                            }}
                            onClick={() => {
                                setShowLogWasteModal(false);
                                navigate('/log-waste-manual'); 
                            }}
                        >
                            Log Waste Manually
                        </button>
                        
                        <button 
                            style={{ 
                                backgroundColor: '#64d493', color: '#000000', border: 'none', 
                                padding: '12px', width: '100%', borderRadius: '25px', 
                                fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' 
                            }}
                            onClick={() => {
                                setShowLogWasteModal(false);
                                navigate('/log-waste-image'); 
                            }}
                        >
                            Log Waste via Image
                        </button>
                    </div>
                </div>
            )}

            {/* 1. TOP HEADER SECTION */}
            <div className="home-header">
                
                <div className="header-top-row">
                    
                    {/* Left Side: Menu and Title */}
                    <div className="header-title-container">
                        <Menu size={32} style={{ cursor: 'pointer', strokeWidth: 2.5, top: '25px', left: '20px', position: 'absolute' }} onClick={() => setIsSidebarOpen(true)} />
                        
                        <h1 className="header-title" style={{ marginLeft: '10px', textAlign: 'center', flex: 1, fontSize: '1.5rem' }}>
                            A Digital Waste<br />Management System
                        </h1>
                    </div>
                    
                    {/* Right Side: The Logo Graphic */}
                    {/* This replaces that empty placeholder div! */}
                    <img 
                        src={logo} 
                        alt="WasteTrack Logo" 
                        style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'contain' }} 
                    />

                </div>
                
                <div className="header-buttons-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
                    {/* Add the onClick routes here! */}
                    <button className="action-button" onClick={() => navigate('/get-started')}>Get Started</button>
                    <button className="action-button" onClick={() => navigate('/learn-more')}>Learn More</button>
                </div>
            </div>

            {/* We will put the Key Features grid right below here next! */}
            {/* 2. KEY FEATURES SECTION */}
            <div className="section-header">
                <h3 className="section-title">Key Features</h3>
                <button style={smallBtnStyle} onClick={() => setIsSidebarOpen(true)}>See All</button>
            </div>
            
            <div className="features-grid">
                {/* Card 1 */}
                <div className="feature-card">
                    <div className="feature-icon-box"><FileText size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Log waste<br/>manually</span>
                </div>
                
                {/* Card 2 */}
                <div className="feature-card">
                    <div className="feature-icon-box"><Camera size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Log waste<br/>via image</span>
                </div>
                
                {/* Card 3 */}
                <div className="feature-card">
                    <div className="feature-icon-box"><Bell size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Set waste<br/>disposal<br/>reminder</span>
                </div>
                
                {/* Card 4 */}
                <div className="feature-card">
                    <div className="feature-icon-box"><Users size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Track<br/>personal<br/>impact</span>
                </div>
            </div>
            
            {/* 3. WASTE TYPES SECTION */}
            <div className="section-header">
                <h3 className="section-title">Waste Types</h3>
                <button style={smallBtnStyle} onClick={() => setShowLogWasteModal(true)}>Log Waste</button>
            </div>
            
            <div className="features-grid">
                <div className="feature-card">
                    {/* Replace the src with your actual local images (e.g., src={plasticImg}) just like your logo! */}
                    <img src={plasticImg} alt="Plastic" className="waste-image-box" />
                    <span className="feature-text">Plastic</span>
                </div>
                
                <div className="feature-card">
                    <img src={paperImg} alt="Paper" className="waste-image-box" />
                    <span className="feature-text">Paper</span>
                </div>
                
                <div className="feature-card">
                    <img src={glassImg} alt="Glass" className="waste-image-box" />
                    <span className="feature-text">Glass</span>
                </div>
                
                <div className="feature-card">
                    <img src={generalImg} alt="General" className="waste-image-box" />
                    <span className="feature-text">General<br/>(food etc.)</span>
                </div>
            </div>

            {/* 4. FIND RECYCLING CENTRES SECTION */}
            <div className="section-header">
                <h3 className="section-title">Find Recycling Centres</h3>
                <button style={smallBtnStyle} onClick={() => navigate('/recycling-centres')}>See All</button>
            </div>
            <div className="map-container">
                <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1FpwgdIBB3xWAbvqqQEH9jr21V9eraAw&ehbc=2E312F&noprof=1" 
                    width="100%" 
                    height="250"
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Recycling Centres in Malaysia"
                ></iframe>
            </div>

            {/* --- SIDEBAR COMPONENT --- */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* 5. BOTTOM NAVIGATION BAR */}
            <div className="bottom-nav">
                
                {/* Home stays here (Already active) */}
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <HomeIcon size={26} color="var(--primary-green)" strokeWidth={2.5} />
                    <span style={{ color: 'var(--primary-green)' }}>Home</span>
                </div>
                
                {/* Routes to Dashboard */}
                <div className="nav-item" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={26} strokeWidth={2.5} />
                    <span>Dashboard</span>
                </div>
                
                {/* Routes to Notification (or whatever you name the route later) */}
                <div className="nav-item" style={{ position: 'relative' }} onClick={() => navigate('/notifications')}>
                    <Bell size={26} strokeWidth={2.5} />
                    {/* Example of a notification badge */}
                    <div className="badge">0</div>
                    <span>Notification</span>
                </div>
                
                {/* Routes to Profile */}
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={26} strokeWidth={2.5} />
                    <span>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default Home;