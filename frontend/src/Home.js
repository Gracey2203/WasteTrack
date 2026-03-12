import React, { useState } from 'react';
import { Menu, FileText, Camera, Bell, Users, Home as HomeIcon, LayoutDashboard, User, X, Recycle } from 'lucide-react';
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
    const [selectedWasteInfo, setSelectedWasteInfo] = useState(null);
    const wasteInfoData = {
        Plastic: {
            title: 'Plastic',
            image: plasticImg, 
            isRecyclable: true,
            description: 'Most rigid plastic bottles and containers can be recycled. Wash them before throwing.',
            items: ['Water bottles', 'Food containers', 'Detergent bottles', 'Grocery bags']
        },
        Paper: {
            title: 'Paper',
            image: paperImg,
            isRecyclable: true,
            description: 'Paper and cardboard are widely recyclable. Keep them completely dry and clean.',
            items: ['Newspapers', 'Cardboard boxes', 'Office papers', 'Magazines']
        },
        Glass: {
            title: 'Glass',
            image: glassImg,
            isRecyclable: true,
            description: 'Glass bottles and jars are 100% recyclable and can be melted down endlessly.',
            items: ['Glass bottles', 'Food jars', 'Sauce bottles', 'Cosmetic jars'] 
        },
        General: {
            title: 'General',
            image: generalImg,
            isRecyclable: false,
            description: 'Items like food, mixed trash, and textiles. (Tip: Use the map to find specialized clothing bins like Kloth Cares!)',
            items: ['Food', 'Clothes', 'Shoes', 'Mixed trash'] // Reverted to perfectly match Kaggle dataset!
        }
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

            {/* 2. KEY FEATURES SECTION */}
            <div className="section-header">
                <h3 className="section-title">Key Features</h3>
                <button style={smallBtnStyle} onClick={() => setIsSidebarOpen(true)}>See All</button>
            </div>
            
            <div className="features-grid">
                {/* Card 1: Log waste manually */}
                <div 
                    className="feature-card" 
                    onClick={() => navigate('/log-waste-manual')} 
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-icon-box"><FileText size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Log waste<br/>manually</span>
                </div>
                
                {/* Card 2: Log waste via image */}
                <div 
                    className="feature-card" 
                    onClick={() => navigate('/log-waste-image')} 
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-icon-box"><Camera size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Log waste<br/>via image</span>
                </div>
                
                {/* Card 3: Set waste disposal reminder */}
                <div 
                    className="feature-card" 
                    onClick={() => navigate('/reminders')} 
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-icon-box"><Bell size={20} strokeWidth={2} /></div>
                    <span className="feature-text">Set waste<br/>disposal<br/>reminder</span>
                </div>
                
                {/* Card 4: Track personal impact */}
                <div 
                    className="feature-card" 
                    onClick={() => navigate('/impact')} 
                    style={{ cursor: 'pointer' }}
                >
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
                <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedWasteInfo('Plastic')}>
                    <img src={plasticImg} alt="Plastic" className="waste-image-box" />
                    <span className="feature-text">Plastic</span>
                </div>
                
                <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedWasteInfo('Paper')}>
                    <img src={paperImg} alt="Paper" className="waste-image-box" />
                    <span className="feature-text">Paper</span>
                </div>
                
                <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedWasteInfo('Glass')}>
                    <img src={glassImg} alt="Glass" className="waste-image-box" />
                    <span className="feature-text">Glass</span>
                </div>
                
                <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedWasteInfo('General')}>
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

            {/* --- WASTE INFO MODAL --- */}
            {selectedWasteInfo && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
                }}>
                    <div style={{ 
                        backgroundColor: '#91acc8', borderRadius: '20px', padding: '20px', 
                        width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' 
                    }}>
                        
                        {/* Title & Image */}
                        <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                            {wasteInfoData[selectedWasteInfo].title}
                        </h2>
                        <img 
                            src={wasteInfoData[selectedWasteInfo].image} 
                            alt={selectedWasteInfo} 
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} 
                        />

                        {/* Recyclable Badge */}
                        <div style={{ backgroundColor: '#64d493', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            {wasteInfoData[selectedWasteInfo].isRecyclable && <Recycle size={18} />}
                            {wasteInfoData[selectedWasteInfo].isRecyclable ? 'Recyclable' : 'Non-Recyclable'}
                        </div>

                        {/* Description */}
                        <div style={{ backgroundColor: '#64d493', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Description</div>
                            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {wasteInfoData[selectedWasteInfo].description}
                            </div>
                        </div>

                        {/* Common Items */}
                        <div style={{ backgroundColor: '#64d493', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Common Items</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {wasteInfoData[selectedWasteInfo].items.map((item, index) => (
                                    <div key={index} style={{ backgroundColor: '#91acc8', padding: '10px 5px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedWasteInfo(null)}
                            style={{ backgroundColor: '#64d493', color: '#000000', border: 'none', borderRadius: '20px', padding: '10px 40px', fontWeight: 'bold', alignSelf: 'center', marginTop: '5px', cursor: 'pointer' }}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;