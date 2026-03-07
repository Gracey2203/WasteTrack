import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Impact = () => { 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [impactData, setImpactData] = useState([]);
    const [view, setView] = useState('month'); // Tracks which button is active

    useEffect(() => {
        const fetchImpact = async () => {
            try {
                const currentUserEmail = "sandy@gmail.com"; 
                const serverIP = window.location.hostname; // This magically grabs your laptop's Wi-Fi IP!
                const response = await fetch(`http://${serverIP}:5000/api/waste-impact?email=${currentUserEmail}&view=${view}&t=${Date.now()}`);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setImpactData(data);
                } else {
                    setImpactData([]); 
                }
            } catch (error) {
                console.error("Network or Fetch error:", error);
                setImpactData([]); 
            }
        };
        fetchImpact();
    }, [view]); // This array tells React to re-fetch whenever 'view' changes

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. THE SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* 2. Header (Perfectly centered, two lines, no overlap) */}
            <div className="page-header" style={{ padding: '20px 20px 10px 20px', display: 'flex', alignItems: 'center' }}>
                <Menu 
                    size={32} 
                    style={{ cursor: 'pointer', strokeWidth: 2.5, flexShrink: 0 }} 
                    onClick={() => setIsSidebarOpen(true)} 
                />
                
                {/* This wrapper automatically centers the text and balances the menu icon! */}
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', paddingRight: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textAlign: 'center'}}>
                        Personal Waste Disposal Impact
                    </h3>
                </div>
            </div>

            {/* 3. MAIN CONTENT AREA (Empty for now!) */}
            {/* --- TOGGLE BUTTONS --- */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
                    <button 
                        onClick={() => setView('month')}
                        style={{ padding: '10px 30px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                 backgroundColor: view === 'month' ? '#64d493' : '#91acc8', 
                                 color: view === 'month' ? 'black' : '#000000', fontWeight: 'bold' }}
                    >
                        Month
                    </button>
                    <button 
                        onClick={() => setView('year')}
                        style={{ padding: '10px 30px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                 backgroundColor: view === 'year' ? '#64d493' : '#91acc8', 
                                 color: view === 'year' ? 'black' : '#000000', fontWeight: 'bold' }}
                    >
                        Year
                    </button>
                </div>

                {/* --- DYNAMIC STACKED BAR CHART --- */}
                <div style={{ backgroundColor: '#91acc8', padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={impactData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            {/* dataKey changed to time_label to handle both months and years */}
                            <XAxis 
                                dataKey="time_label" 
                                axisLine={false} 
                                tickLine={false} 
                                interval={0} 
                                angle={-45}           /* Tilts the text so it never overlaps */
                                textAnchor="end"      /* Anchors the text nicely to the tick mark */
                                height={60}           /* Gives extra space at the bottom so the tilted text isn't cut off */
                                tick={{ fontSize: 12, fill: '#4a5568' }} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                interval={0} tick={{ fontSize: 12, fill: '#4a5568' }}/>
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend 
                                iconType="square" 
                                verticalAlign="bottom" 
                                wrapperStyle={{ 
                                    paddingTop: '20px', 
                                    display: 'flex', 
                                    justifyContent: 'flex-end', /* This is the CSS magic that forces it to the right */
                                    width: '100%' 
                                }} 
                            />
                            
                            <Bar dataKey="Plastic" stackId="a" fill="#D53F8C" /> {/* Rich Magenta */}
                            <Bar dataKey="Paper" stackId="a" fill="#3182CE" />   {/* Strong Blue */}
                            <Bar dataKey="Glass" stackId="a" fill="#38A169" />   {/* Deep Emerald Green */}
                            <Bar dataKey="General" stackId="a" fill="#DD6B20" /> {/* Vibrant Orange */}
                        </BarChart>
                    </ResponsiveContainer>
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

export default Impact;