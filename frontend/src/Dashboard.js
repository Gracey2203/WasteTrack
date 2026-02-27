import React, { useState, useEffect } from 'react';
import { Menu, PieChart, Home as HomeIcon, LayoutDashboard, Bell, User, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [userName, setUserName] = useState('User');
    const [currentDate, setCurrentDate] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // State to hold the numbers from your database
    const [stats, setStats] = useState({
        totalItems: 0,
        totalWeight: 0,
        solidPercent: 0,
        nonSolidPercent: 0
    });

    const fetchStats = async () => {
        setIsRefreshing(true); // Triggers spinning animation on the icon
        
        try {
            // Fetch the data from your new Flask route
            const response = await fetch('http://192.168.0.8:5000/dashboard-stats');
            const data = await response.json();
            
            if (response.status === 200) {
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }

        // Update the timestamp to the exact second it was refreshed
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute:'2-digit', second:'2-digit' });
        setCurrentDate(`${formattedDate} at ${formattedTime}`);
        
        // Stop spinning after a brief delay so the user feels the refresh action
        setTimeout(() => setIsRefreshing(false), 500); 
    };

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName);
        
        // Load stats immediately when the page opens
        fetchStats();
    }, []);

    // A small helper style to put text nicely inside those green pills
    const pillStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        color: '#000', fontSize: '0.75rem', fontWeight: 'bold'
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. HEADER */}
            <div className="dashboard-header">
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                <h1 className="dashboard-title">User Dashboard</h1>
            </div>

            {/* 2. GREETING & REFRESH ICON */}
            <div className="dashboard-greeting" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ marginBottom: '5px' }}>Hello, {userName} !</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                    <span>Last refreshed: {currentDate}</span>
                    <RefreshCw 
                        size={16} 
                        style={{ cursor: 'pointer', color: 'var(--text-dark)' }} 
                        className={isRefreshing ? "spin-animation" : ""}
                        onClick={fetchStats} 
                    />
                </div>
            </div>

            {/* 3. STATS GRID */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total<br/>Items<br/>Recycled</h4>
                    <p>In Numbers</p>
                    <div className="stat-pill" style={pillStyle}>{stats.totalItems}</div>
                </div>
                
                <div className="stat-card">
                    <h4>Total<br/>Waste<br/>Gathered</h4>
                    <p>In Kg</p>
                    <div className="stat-pill" style={pillStyle}>{stats.totalWeight}</div>
                </div>
                
                <div className="stat-card">
                    <h4>% of<br/>Solid<br/>Waste</h4>
                    <p>In Percentage</p>
                    <div className="stat-pill" style={pillStyle}>{stats.solidPercent}%</div>
                </div>
                
                <div className="stat-card">
                    <h4>% of<br/>Non-solid<br/>Waste</h4>
                    <p>In Percentage</p>
                    <div className="stat-pill" style={pillStyle}>{stats.nonSolidPercent}%</div>
                </div>
            </div>

            {/* 4. WASTE CHART SECTION */}
            <div className="chart-section" style={{ flexGrow: 1 }}>
                <div className="chart-header">
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Waste Chart</h3>
                    <span style={{ fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}>Calculate</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <PieChart size={50} strokeWidth={2} color="#111" />
                </div>

                <div className="progress-container">
                    <div className="progress-label-row">
                        <span>Total Items Recycled</span>
                        <span>{stats.totalItems} items</span>
                    </div>
                    {/* Width dynamically updates here */}
                    <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min((stats.totalItems / 50) * 100, 100)}%` }}></div></div>
                </div>

                <div className="progress-container">
                    <div className="progress-label-row">
                        <span>Total Waste Gathered</span>
                        <span>{stats.totalWeight} kg</span>
                    </div>
                    {/* Width dynamically updates here */}
                    <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min((stats.totalWeight / 20) * 100, 100)}%` }}></div></div>
                </div>
                
                {/* Progress Bars (Width dynamically driven by database percentages) */}
                <div className="progress-container">
                    <div className="progress-label-row">
                        <span>Percentage of Solid Waste</span><span>{stats.solidPercent}%</span>
                    </div>
                    {/* Width dynamically updates here */}
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${stats.solidPercent}%` }}></div></div>
                </div>

                <div className="progress-container">
                    <div className="progress-label-row">
                        <span>Percentage of Non-solid Waste</span><span>{stats.nonSolidPercent}%</span>
                    </div>
                    {/* Width dynamically updates here */}
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${stats.nonSolidPercent}%` }}></div></div>
                </div>
            </div>

            {/* --- SIDEBAR COMPONENT --- */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
                
            {/* 5. BOTTOM NAVIGATION BAR */}
            <div className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <HomeIcon size={26} strokeWidth={2.5} />
                    <span>Home</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/dashboard')}>
                    <div style={{ backgroundColor: 'var(--primary-green)', padding: '3px', borderRadius: '6px', display: 'flex' }}>
                        <LayoutDashboard size={20} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{ color: 'var(--primary-green)' }}>Dashboard</span>
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

export default Dashboard;