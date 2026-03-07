import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, Lightbulb, Recycle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';

const initialAlerts = [
    { id: 'tip-1', type: 'tip', title: 'New Tip', time: '1 Minute Ago', desc: 'Did you know not all plastics are recyclable? Check out the new sorting list!', icon: Lightbulb, iconBg: 'var(--primary-green)', status: 'active' },
    { id: 'tip-2', type: 'recycling', title: 'Recycling Day', time: '2 Minutes Ago', desc: 'Place sorted waste out for collection!', icon: Recycle, iconBg: 'var(--primary-green)', status: 'active' }
];

const Notifications = () => {
    // These were the missing lines! They set up the memory for the page.
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [alerts, setAlerts] = useState([]); 

    // 1. FETCH FROM DATABASE
    useEffect(() => {
        const fetchDatabaseReminders = async () => {
            const userEmail = localStorage.getItem('savedEmail');
            if (!userEmail) {
                setAlerts(initialAlerts);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/reminders/${userEmail}`);
                if (response.ok) {
                    const dbReminders = await response.json();
                    
                    const formattedReminders = dbReminders.map(rem => ({
                        id: rem.id, 
                        type: 'reminder',
                        title: 'Reminder!',
                        time: `${rem.date} at ${rem.time}`, 
                        desc: `Reminder set to throw ${rem.wasteType} waste on ${rem.date} at ${rem.location}`,
                        icon: Trash2,
                        iconBg: 'var(--primary-green)',
                        status: rem.status || 'active', 
                        isNew: false 
                    }));
                    setAlerts([...formattedReminders, ...initialAlerts]);
                } else {
                    setAlerts(initialAlerts);
                }
            } catch (error) {
                console.error("Failed to fetch from Flask:", error);
                setAlerts(initialAlerts);
            }
        };
        fetchDatabaseReminders();
    }, []);

    // 2. SWIPE TO DISMISS (Updates DB)
    const handleSwipeAction = async (id, newStatus) => {
        setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status: newStatus } : alert));
        
        if (typeof id === 'number') {
            await fetch(`${process.env.REACT_APP_API_URL}/reminders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        }
    };

    // 3. PERMANENT DELETE (Removes from DB)
    const handleDeleteAction = async (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        
        if (typeof id === 'number') {
            await fetch(`${process.env.REACT_APP_API_URL}/reminders/${id}`, { method: 'DELETE' });
        }
    };

    // 4. SWIPEABLE CARD COMPONENT
    const SwipeableCard = ({ alert }) => {
        const [translateX, setTranslateX] = useState(0);
        const [startX, setStartX] = useState(0);

        const handleTouchStart = (e) => setStartX(e.touches[0].clientX);

        const handleTouchMove = (e) => {
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            if (alert.status === 'active' && diff > 0) setTranslateX(diff);
            if (alert.status === 'dismissed' && diff < 0) setTranslateX(diff);
        };

        const handleTouchEnd = () => {
            if (alert.status === 'active' && translateX > 100) {
                handleSwipeAction(alert.id, 'dismissed'); 
            } else if (alert.status === 'dismissed' && translateX < -100) {
                handleDeleteAction(alert.id); 
            }
            setTranslateX(0); 
        };

        const IconComponent = alert.icon;
        
        const cardStyle = {
            transform: `translateX(${translateX}px)`,
            transition: translateX === 0 ? 'transform 0.3s ease' : 'none',
            backgroundColor: alert.status === 'active' ? 'var(--primary-green)' : 'var(--grey-blue)',
            color: 'black'
        };

        return (
            <div 
                className={`alert-card ${alert.isNew ? 'slide-in-top' : ''}`} 
                style={cardStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="alert-icon-box" style={{ backgroundColor: alert.iconBg, padding: '10px' }}>
                    <IconComponent size={24} color="black" />
                </div>
                
                <div className="alert-content" style={{ flex: 1 }}>
                    <h4>{alert.title}</h4>
                    <span>{alert.time}</span>
                    <p style={{ marginTop: '5px' }}>{alert.desc}</p>
                </div>
            </div>
        );
    };

    // 5. THE UI RENDER
    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <div className="page-header">
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                <h1 className="page-title">Notifications, Tips &<br/>Reminders</h1>
            </div>

            <div className="toggle-container">
                <button className={`toggle-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active</button>
                <button className={`toggle-btn ${activeTab === 'dismissed' ? 'active' : ''}`} onClick={() => setActiveTab('dismissed')}>Dismissed</button>
            </div>

            <div className="alert-header-row">
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{activeTab === 'active' ? 'Active Alerts ‼️' : 'Dismissed Alerts'}</h3>
                <span style={{ fontSize: '0.65rem', color: '#555' }}>{activeTab === 'active' ? 'Swipe right to dismiss' : 'Swipe left to delete'}</span>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                {alerts.filter(alert => alert.status === activeTab).length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#777', marginTop: '20px', fontSize: '0.9rem' }}>No {activeTab} alerts.</p>
                ) : (
                    alerts.filter(alert => alert.status === activeTab).map(alert => (
                        <SwipeableCard key={alert.id} alert={alert} />
                    ))
                )}
            </div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
                
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
                    <Bell size={26} strokeWidth={2.5} color="var(--primary-green)" />
                    <div className="badge">{alerts.filter(a => a.status === 'active').length}</div>
                    <span style={{ color: 'var(--primary-green)' }}>Notification</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={26} strokeWidth={2.5} />
                    <span>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default Notifications;