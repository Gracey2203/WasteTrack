import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './App.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const menuItems = [
        { name: 'Summary', path: '/summary' }, 
        { name: 'Log waste manually', path: '/log-waste-manual' }, 
        { name: 'Log waste via image', path: '/log-waste-image' },
        { name: 'Set waste disposal reminder', path: '/reminders' },
        { name: 'Track personal impact', path: '/impact' },
        { name: 'Find recycling centres', path: '/recycling-centres' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        toggleSidebar(); 
    };

    const handleLogout = () => {
        localStorage.removeItem('savedEmail');// Clears the saved email so next time it goes back to the login screen
        toggleSidebar();
        navigate('/'); 
    };

    return (
        <>
            {/* The Backdrop - Added touchAction to stop scrolling on the faded background */}
            <div 
                className={`sidebar-backdrop ${isOpen ? 'show' : ''}`} 
                onClick={toggleSidebar}
                style={{ touchAction: 'none' }}
            ></div>

            <div 
                className={`sidebar-container ${isOpen ? 'open' : ''}`}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100dvh', 
                    zIndex: 9999,
                    overflowX: 'hidden', 
                    overscrollBehavior: 'none', /* STOPS iOS ELASTIC BOUNCE & SWIPE */
                    boxSizing: 'border-box',
                    position: 'fixed', /* Ensures it floats above the page instead of pushing it */
                    top: 0
                }}
            >
                {/* --- TOP SECTION --- */}
                <div>
                    <div style={{ padding: '30px 20px 20px 20px', borderBottom: '2px solid rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#111', letterSpacing: '-0.5px', textAlign: 'center' }}>
                            All features
                        </h2>
                    </div>

                    <div style={{ paddingTop: '10px' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div
                                    key={item.name}
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- BOTTOM SECTION --- */}
                {/* FIX 1: Dropped bottom padding to 30px */}
                {/* FIX 2: Removed width: 100% to stop horizontal overflow */}
                <div style={{ padding: '20px 20px 20px 20px', borderTop: '2px solid rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                    <div 
                        onClick={handleLogout}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '12px', 
                            padding: '12px 15px', 
                            color: '#e53e3e',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '12px',
                            margin: '0 auto' 
                        }}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        <span>Log out</span>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Sidebar;