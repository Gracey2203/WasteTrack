import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, Leaf, Droplets, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Impact = () => { 
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [impactData, setImpactData] = useState([]);
    const [view, setView] = useState('month'); 

    // --- NEW: State for the calculated totals ---
    const [totals, setTotals] = useState({ carbon: 0, water: 0, energy: 0 });

    useEffect(() => {
        const fetchImpact = async () => {
            try {
                // 1. DYNAMIC USER EMAIL: Grabs the email of whoever is currently logged in!
                const currentUserEmail = localStorage.getItem('savedEmail');
                
                // 2. SAFETY CHECK: If no one is logged in, don't try to fetch data
                if (!currentUserEmail) {
                    console.log("No user is logged in.");
                    setImpactData([]);
                    setTotals({ carbon: 0, water: 0, energy: 0 });
                    return; 
                }

                const serverIP = window.location.hostname; 
                const response = await fetch(`http://${serverIP}:5000/api/waste-impact?email=${currentUserEmail}&view=${view}&t=${Date.now()}`);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setImpactData(data);
                    
                    let totalPlastic = 0;
                    let totalPaper = 0;
                    let totalGlass = 0;
                    let totalGeneral = 0;

                    data.forEach(entry => {
                        totalPlastic += (entry.Plastic || 0);
                        totalPaper += (entry.Paper || 0);
                        totalGlass += (entry.Glass || 0);
                        totalGeneral += (entry.General || 0);
                    });

                    // UC008 REQUIREMENT: Apply environmental conversion factors!
                    const calculatedCarbon = (totalPlastic * 1.5) + (totalPaper * 0.9) + (totalGlass * 0.3) + (totalGeneral * 0.1);
                    const calculatedWater = (totalPaper * 20) + (totalPlastic * 5);
                    const calculatedEnergy = (totalGlass * 0.4) + (totalPlastic * 2.2) + (totalPaper * 1.1);

                    setTotals({
                        carbon: calculatedCarbon.toFixed(1), 
                        water: Math.round(calculatedWater),  
                        energy: Math.round(calculatedEnergy) 
                    });

                } else {
                    setImpactData([]); 
                    setTotals({ carbon: 0, water: 0, energy: 0 });
                }
            } catch (error) {
                console.error("Network or Fetch error:", error);
                setImpactData([]); 
                setTotals({ carbon: 0, water: 0, energy: 0 });
            }
        };
        fetchImpact();
    }, [view]);

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            <div className="page-header" style={{ padding: '20px 20px 10px 20px', display: 'flex', alignItems: 'center' }}>
                <Menu size={32} style={{ cursor: 'pointer', strokeWidth: 2.5, flexShrink: 0 }} onClick={() => setIsSidebarOpen(true)} />
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', paddingRight: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textAlign: 'center'}}>
                        Personal Waste Disposal Impact
                    </h3>
                </div>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                
                {/* --- NEW: UC008 PERSONAL IMPACT METRICS --- */}
                <div style={{ margin: '20px 20px 10px 20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: 800, textAlign: 'center' }}>
                        Your Environmental Impact
                    </h3>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, backgroundColor: '#64d493', borderRadius: '15px', padding: '15px 5px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <Leaf size={24} color="#000000" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>{totals.carbon}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', lineHeight: '1.2', marginTop: '4px' }}>kg CO₂<br/>Saved</div>
                        </div>

                        <div style={{ flex: 1, backgroundColor: '#64d493', borderRadius: '15px', padding: '15px 5px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <Droplets size={24} color="#000000" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>{totals.water}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', lineHeight: '1.2', marginTop: '4px' }}>Liters<br/>Saved</div>
                        </div>

                        <div style={{ flex: 1, backgroundColor: '#64d493', borderRadius: '15px', padding: '15px 5px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <Zap size={24} color="#000000" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>{totals.energy}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', lineHeight: '1.2', marginTop: '4px' }}>kWh<br/>Saved</div>
                        </div>
                    </div>
                </div>

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

                <div style={{ margin: '0 20px 20px 20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800, textAlign: 'center' }}>
                        Waste Logging History
                    </h3>
                    <div style={{ backgroundColor: '#91acc8', padding: '20px', borderRadius: '12px' }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={impactData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time_label" axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12, fill: '#4a5568' }} />
                                <YAxis axisLine={false} tickLine={false} interval={0} tick={{ fontSize: 12, fill: '#4a5568' }}/>
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend 
                                    iconType="square" 
                                    verticalAlign="bottom" 
                                    iconSize={12} /* 1. Shrinks the color boxes slightly */
                                    wrapperStyle={{ 
                                        paddingTop: '15px', 
                                        fontSize: '15px', /* 2. Shrinks the text so it fits on iPhones! */
                                        display: 'flex', 
                                        justifyContent: 'center', /* 3. Centers the items to use maximum screen width */
                                        width: '100%',
                                        marginLeft: '15px' /* Optional: Nudges it slightly left to visually center it with the Y-Axis */
                                    }} 
                                />
                                <Bar dataKey="Plastic" stackId="a" fill="#D53F8C" /> 
                                <Bar dataKey="Paper" stackId="a" fill="#3182CE" />  
                                <Bar dataKey="Glass" stackId="a" fill="#38A169" />  
                                <Bar dataKey="General" stackId="a" fill="#DD6B20" /> 
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/home')}><HomeIcon size={26} strokeWidth={2.5} /><span>Home</span></div>
                <div className="nav-item" onClick={() => navigate('/dashboard')}><LayoutDashboard size={26} strokeWidth={2.5} /><span>Dashboard</span></div>
                <div className="nav-item" style={{ position: 'relative' }} onClick={() => navigate('/notifications')}><Bell size={26} strokeWidth={2.5} /><div className="badge">0</div><span>Notification</span></div>
                <div className="nav-item" onClick={() => navigate('/profile')}><User size={26} strokeWidth={2.5} /><span>Profile</span></div>
            </div>

        </div>
    );
};

export default Impact;