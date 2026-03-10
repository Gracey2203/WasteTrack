import React from 'react';
import { ChevronLeft, Menu, LayoutDashboard, Trash2, MapPin, BarChart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
    const navigate = useNavigate();

    // Reusable style for the green cards
    const cardStyle = {
        backgroundColor: '#64d493', // Matches your primary green
        borderRadius: '12px',
        padding: '15px 20px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        color: '#000000'
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--light-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Curved Green Header */}
            <div style={{ backgroundColor: '#64d493', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', padding: '30px 20px', position: 'relative', textAlign: 'center' }}>
                <ChevronLeft size={28} style={{ position: 'absolute', left: '20px', top: '30px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
                <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>How to navigate</h1>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Your quick guide to using WasteTrack</p>
            </div>

            {/* Content List */}
            <div style={{ padding: '25px 20px', flexGrow: 1, overflowY: 'auto' }}>
                
                <div style={cardStyle}>
                    <Menu size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Easy Navigation</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Use the sidebar menu or bottom tabs to quickly access all features of the application.</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <LayoutDashboard size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Dashboard Overview</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Track your daily statistics, recycling progress, and waste reduction goals at a glance.</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <Trash2 size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Log Waste</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Easily log your waste manually or use the AI camera feature to identify items instantly.</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <MapPin size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Find Centres</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Locate nearby recycling centres or waste disposal facilities with the interactive map.</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <BarChart size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Track Impact</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Monitor your environmental footprint and see how your habits contribute to a greener planet.</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <Bell size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>Smart Reminders</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>Set custom notifications so you never forget to take out the recycling or log your daily waste.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div style={{ padding: '0 20px 30px 20px' }}>
                <button 
                    className="green-button" 
                    onClick={() => navigate('/home')} 
                    style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', fontWeight: 'bold' }}
                >
                    Start using app 
                </button>
            </div>
        </div>
    );
};

export default GetStarted;