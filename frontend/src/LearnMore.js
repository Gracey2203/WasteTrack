import React from 'react';
import { ChevronLeft, Globe, Recycle, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearnMore = () => {
    const navigate = useNavigate();

    // Reusable style for centered text cards
    const cardStyle = {
        backgroundColor: '#64d493',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000000'
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--light-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Curved Green Header */}
            <div style={{ backgroundColor: '#64d493', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', padding: '30px 20px', position: 'relative', textAlign: 'center' }}>
                <ChevronLeft size={28} style={{ position: 'absolute', left: '20px', top: '30px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
                <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>About WasteTrack</h1>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Building a cleaner Malaysia together</p>
            </div>

            {/* Content List */}
            <div style={{ padding: '25px 20px', flexGrow: 1, overflowY: 'auto' }}>
                
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Globe size={20} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>The Mission</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        WasteTrack is Malaysia's digital waste management solution designed to empower communities in Kuala Lumpur and beyond. The aim is to reduce landfill waste by at least 30% through smart tracking.
                    </p>
                </div>

                <h3 style={{ textAlign: 'center', margin: '20px 0 15px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Why It Matters</h3>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Recycle size={20} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Efficient Recycling</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        Connecting you directly with local recycling centers to ensure your waste is processed correctly.
                    </p>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Database size={20} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Data-Driven Impact</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        Visualize your contribution to a greener environment with real-time analytics and tracking.
                    </p>
                </div>

            </div>

            {/* Bottom Section */}
            <div style={{ padding: '0 20px 30px 20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>Ready to make an impact?</p>
                <button 
                    className="green-button" 
                    onClick={() => navigate('/register')} 
                    style={{ margin: 0, width: '100%', fontWeight: 'bold' }}
                >
                    Create free account
                </button>
            </div>
        </div>
    );
};

export default LearnMore;