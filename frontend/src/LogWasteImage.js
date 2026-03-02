import React, { useState } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

const LogWasteImage = () => { 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. THE SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* 2. THE HEADER */}
            <div className="page-header">
                {/* The clickable Menu icon that opens the Sidebar */}
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                
                <h1 className="page-title">Log Waste Image</h1> 
            </div>

            {/* 3. MAIN CONTENT AREA (Empty for now!) */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <p style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>Content coming soon...</p>
            </div>

            {/* 4. THE BOTTOM NAVIGATION BAR */}
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

export default LogWasteImage;