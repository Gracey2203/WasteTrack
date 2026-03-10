import React, { useState, useRef, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, Calendar, Clock, Search, Edit3, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

const Reminder = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form States
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const routerLocation = useLocation(); 

    useEffect(() => {
        // If we came back with data, unpack it into the state variables!
        if (routerLocation.state) {
            if (routerLocation.state.selectedLocation) setLocation(routerLocation.state.selectedLocation);
            if (routerLocation.state.draftDate) setDate(routerLocation.state.draftDate);
            if (routerLocation.state.draftTime) setTime(routerLocation.state.draftTime);
            if (routerLocation.state.draftWasteType) setWasteType(routerLocation.state.draftWasteType);
            if (routerLocation.state.draftAmount) setAmount(routerLocation.state.draftAmount);
            if (routerLocation.state.draftNotes) setNotes(routerLocation.state.draftNotes);
        }
    }, [routerLocation]);

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    // Notification State
    const [showNotification, setShowNotification] = useState(false);

    const handleSave = async () => {
        // Basic validation
        if (!date || !time || !location || !wasteType) {
            alert("Please fill in the Date, Time, Location, and Waste Type!");
            return;
        }

        // Get the logged-in user's email to link the reminder to their account
        const userEmail = localStorage.getItem('savedEmail');
        
        if (!userEmail) {
            alert("Error: Could not find user email. Please log in again.");
            return;
        }

        // Prepare the payload for Flask
        const reminderData = {
            email: userEmail,
            date: date,
            time: time,
            location: location,
            wasteType: wasteType,
            amount: amount,
            notes: notes
        };

        try {
            // Send the data to your Python backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reminderData)
            });

            if (response.ok) {
                // 1. Show the beautiful green success notification locally
                setShowNotification(true);

                // 2. Save the notification to LocalStorage for the Notifications Page!
                const newNotification = {
                    id: Date.now(),
                    type: 'reminder',
                    message: `Reminder set to throw ${wasteType} waste on ${date} at ${location}`,
                    timestamp: new Date().toISOString(),
                    isRead: false
                };
                
                // Pull existing notifications, add the new one to the top, and save back
                const existingNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
                existingNotifications.unshift(newNotification); 
                localStorage.setItem('userNotifications', JSON.stringify(existingNotifications));

                // 3. Automatically hide local popup after 4 seconds and clear the form
                setTimeout(() => {
                    setShowNotification(false);
                    setDate('');
                    setTime('');
                    setLocation('');
                    setWasteType('');
                    setAmount('');
                    setNotes('');
                }, 4000);
            } else {
                const errorData = await response.json();
                alert(`Failed to save reminder: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error saving reminder:", error);
            alert("Error connecting to the server. Is your Flask backend running?");
        }
    };

    // Shared styling for the input wrappers to match your mockup perfectly
    const inputWrapperStyle = {
        position: 'relative',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: '#91acc8', // The grey-blue from mockup
        border: 'none',
        borderRadius: '8px',
        padding: '12px 40px 12px 15px', // Extra right padding for the icons
        fontSize: '1rem',
        color: '#000000',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        minHeight: '48px', // Force it to have a minimum standard touch height!
        WebkitAppearance: 'none'// Removes specific iOS or Safari native box styling rules
    };

    const iconStyle = {
        position: 'absolute',
        right: '12px',
        color: '#000000',
        pointerEvents: 'none' // Lets clicks pass through to the input
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* Figma Frame 11: The Green Success Notification */}
            {showNotification && (
                <div style={{
                    position: 'absolute',
                    top: '80px', // Drops it just below the header
                    left: '7%',
                    width: '80%',
                    backgroundColor: '#64d493', // var(--primary-green)
                    borderRadius: '12px',
                    padding: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    animation: 'fadeInDown 0.3s ease-out'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                        <Trash2 size={24} color="#000000" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>Saved!</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.3' }}>
                            Reminder set to throw {wasteType} on {date} at {location}
                        </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#000000', alignSelf: 'flex-start' }}>now</span>
                </div>
            )}

            {/* Header (Perfectly centered, two lines, no overlap) */}
            <div className="page-header" style={{ padding: '20px 20px 10px 20px', display: 'flex', alignItems: 'center' }}>
            <Menu 
                size={32} 
                style={{ cursor: 'pointer', strokeWidth: 2.5, flexShrink: 0 }} 
                onClick={() => setIsSidebarOpen(true)} 
            />
                            
            {/* This wrapper automatically centers the text and balances the menu icon! */}
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', paddingRight: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textAlign: 'center'}}>
                    Waste Disposal Reminder Form
                </h3>
            </div>
            </div>

            {/* Main Form Area */}
            <div style={{ flexGrow: 1, padding: '10px 30px 30px 30px', overflowY: 'auto' }}>
                
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Date</label>
                <div 
                    onClick={() => dateInputRef.current && dateInputRef.current.showPicker()} 
                    style={{ position: 'relative', marginBottom: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <input 
                        type="date" 
                        ref={dateInputRef} 
                        style={{...inputStyle, width: '100%'}} 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                    <Calendar size={20} style={iconStyle} />
                </div>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Time</label>
                <div 
                    onClick={() => timeInputRef.current && timeInputRef.current.showPicker()} 
                    style={{ position: 'relative', marginBottom: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <input 
                        type="time" 
                        ref={timeInputRef} 
                        style={{...inputStyle, width: '100%'}} 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                    />
                    <Clock size={20} style={iconStyle} />
                </div>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Location</label>
                <div 
                    style={{...inputWrapperStyle, cursor: 'pointer'}} 
                    // Clicking the box opens the search page!
                    onClick={() => navigate('/recycling-centres', {
                        state: { 
                            draftDate: date, 
                            draftTime: time, 
                            draftWasteType: wasteType, 
                            draftAmount: amount, 
                            draftNotes: notes 
                        }
                    })} 
                >
                    <input 
                        type="text" 
                        className="custom-search-input" // Use the new CSS class for styling
                        style={{...inputStyle, cursor: 'pointer'}} 
                        value={location} 
                        readOnly // Makes it so they can't type randomly, they MUST search
                        placeholder="Click to search centres..." 
                    />
                    <Search size={20} style={iconStyle} />
                </div>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Waste Type</label>
                <div style={inputWrapperStyle}>
                    <select style={{ ...inputStyle, appearance: 'none' }} className="waste-dropdown" value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
                        <option value="" disabled>Choose an option</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Paper">Paper</option>
                        <option value="Glass">Glass</option>
                        <option value="General">General (food, clothes, shoes, mixed trash)</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <ChevronDown 
                        size={20} 
                        color="#000000" 
                        style={{ 
                            position: 'absolute', 
                            right: '15px', 
                            top: '35%', 
                            transform: 'translateY(-50%)', 
                            pointerEvents: 'none' // This is the magic trick!
                        }} 
                    />
                </div>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Amount of waste (kg)</label>
                <div style={inputWrapperStyle}>
                    <input 
                        type="number" 
                        min="0" 
                        step="any" /* Allows decimals like 1.5kg */
                        inputMode="decimal" /* Forces the BEST numeric keypad to open on mobile phones */
                        onKeyDown={(e) => {
                            /* Completely blocks the minus sign and 'e' from being typed on a laptop */
                            if (e.key === '-' || e.key === 'e') {
                                e.preventDefault();
                            }
                        }}
                        style={inputStyle} 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                    />
                    <Edit3 size={20} style={iconStyle} />
                </div>

                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Notes</label>
                <div style={{ ...inputWrapperStyle, alignItems: 'flex-start' }}>
                    <textarea 
                        style={{ ...inputStyle, paddingRight: '15px', minHeight: '100px', resize: 'vertical' }} 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* Save Button */}
                <button 
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        backgroundColor: '#64d493', // var(--primary-green)
                        color: '#111',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        marginTop: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    Save
                </button>

            </div>

            {/* Bottom Navigation */}
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

export default Reminder;