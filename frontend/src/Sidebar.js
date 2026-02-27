import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation(); // This grabs the current URL path!

    // The list of links matching your design
    const menuItems = [
        { name: 'Summary', path: '/summary' }, 
        { name: 'Log waste manually', path: '/log-waste-manual' }, // We will build this next!
        { name: 'Log waste via image', path: '/log-waste-image' },
        { name: 'Set waste storage reminder', path: '/reminders' },
        { name: 'Track personal impact', path: '/impact' },
        { name: 'Find recycling centres', path: '/recycling-centres' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        toggleSidebar(); // Automatically close the sidebar after clicking a link
    };

    return (
        <>
            {/* 1. The dark clickable background */}
            <div 
                className={`sidebar-backdrop ${isOpen ? 'show' : ''}`} 
                onClick={toggleSidebar} 
            ></div>

            {/* 2. The sliding sidebar itself */}
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                {menuItems.map((item) => {
                    // Check if the current URL matches the item's path to apply the green active class
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
        </>
    );
};

export default Sidebar;