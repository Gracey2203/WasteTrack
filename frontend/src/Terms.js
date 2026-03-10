import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--light-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Curved Green Header */}
            <div style={{ backgroundColor: '#64d493', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', padding: '30px 20px', position: 'relative', textAlign: 'center' }}>
                <ChevronLeft size={28} style={{ position: 'absolute', left: '20px', top: '30px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => navigate(-1)} />
                <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>Terms & Conditions</h1>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Understand your data and privacy rights</p>
            </div>

            {/* Content Container */}
            <div style={{ padding: '25px 20px', flexGrow: 1, overflowY: 'auto' }}>
                <div style={{ 
                    backgroundColor: '#91acc8', 
                    borderRadius: '15px', 
                    padding: '25px 20px', 
                    color: '#000000',
                    textAlign: 'center' 
                }}>
                    
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800 }}>Introduction</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Welcome to WasteTrack. By using our application, you agree to these terms and conditions. Please read them carefully.
                    </p>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800 }}>1. User Data & Privacy</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Collection of minimal data necessary for the functionality of the app, such as your waste logging history and location data for finding recycling centres. Your personal data will not be sold to third parties.
                    </p>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800 }}>2. App Usage</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        You agree to use WasteTrack only for lawful purposes. You are responsible for all activities under your account.
                    </p>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800 }}>3. Content Ownership</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        All content provided on this application, including text, graphics, logos, and images, is the property of WasteTrack or its content suppliers.
                    </p>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800 }}>4. Changes to Terms</h3>
                    <p style={{ margin: '0 0 30px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        WasteTrack reserves the right to modify these terms at any time. Your continued use of the app constitutes acceptance of those changes.
                    </p>

                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                        Last updated: April 2026
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Terms;