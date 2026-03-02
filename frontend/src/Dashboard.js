import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, RefreshCw, AlignCenter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [userName, setUserName] = useState('User');
    const [currentDate, setCurrentDate] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. One single state object to hold EVERYTHING
    const [stats, setStats] = useState({
        totalItems: 0,
        totalWeight: 0,
        solidPercent: 0,
        nonSolidPercent: 0
    });

    // 2. The master fetch function
    const fetchStats = async () => {
        setIsRefreshing(true); 
        const userEmail = localStorage.getItem('savedEmail');

        if (userEmail) {
            try {
                // Pointing to your new all-in-one Flask route!
                const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard-stats/${userEmail}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalItems: data.totalItems,
                        totalWeight: data.totalWeight,
                        solidPercent: data.solidPercent,
                        nonSolidPercent: data.nonSolidPercent
                    });
                } else {
                    console.error("Failed to fetch stats from server.");
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }

        // Update the refresh timestamp
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute:'2-digit', second:'2-digit' });
        setCurrentDate(`${formattedDate} at ${formattedTime}`);
        
        setTimeout(() => setIsRefreshing(false), 500); 
    };

    // 3. Load immediately on page open
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName);
        fetchStats();
    }, []);

    // A small helper style to put text nicely inside those green pills
    const pillStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        color: '#000', fontSize: '0.75rem', fontWeight: 'bold'
    };

    // Prepare data for the Pie Chart based on your real percentages
    const pieData = [
        { name: 'Solid Waste', value: stats.solidPercent },
        { name: 'Non-solid Waste', value: stats.nonSolidPercent }
    ];
    
    // Two shades of green (Primary green, and a lighter translucent green)
    const pieColors = ['#64d493', '#A7F3D0'];

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
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Waste Chart</h3>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', minHeight: '160px', alignItems: 'center' }}>
                {stats.totalWeight > 0 ? (
                    <PieChart width={160} height={160}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            paddingAngle={1}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                        </Pie>
                        {/* Adds a nice hover popup showing the exact percentage */}
                        <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                ) : (
                    <p style={{ color: '#777', fontSize: '0.9rem', fontStyle: 'italic' }}>No waste logged yet.</p>
                )}
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