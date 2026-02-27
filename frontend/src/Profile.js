import React, { useState, useEffect } from 'react';
import { Menu, Home as HomeIcon, LayoutDashboard, Bell, User, Edit, Eye, EyeOff, Camera, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';

const Profile = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // We store the original email separately so the database can find the user even if they change their email!
    const [originalEmail, setOriginalEmail] = useState('lucy@email.com');

    const [userInfo, setUserInfo] = useState({
        name: 'Lucy',
        email: 'lucy@email.com',
        password: 'Track!' 
    });

    const [editingField, setEditingField] = useState(null); 
    const [editValue, setEditValue] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('savedEmail');
        
        if (storedName) setUserInfo(prev => ({ ...prev, name: storedName }));
        if (storedEmail) {
            setUserInfo(prev => ({ ...prev, email: storedEmail }));
            setOriginalEmail(storedEmail); // Keep track of the real email for DB updates
        }
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const handleEditClick = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    // --- NEW: SAVES TO DATABASE ---
    const handleSave = async () => {
        try {
            // Send the specific edited field to the Flask backend
            const response = await fetch('http://192.168.0.8:5000/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_email: originalEmail,
                    field: editingField,
                    value: editValue
                })
            });

            if (response.ok) {
                // Update the React UI
                setUserInfo(prev => ({ ...prev, [editingField]: editValue }));
                
                // Update local storage so it remembers the change on refresh
                if (editingField === 'name') localStorage.setItem('userName', editValue);
                if (editingField === 'email') {
                    localStorage.setItem('savedEmail', editValue);
                    setOriginalEmail(editValue); // Update the DB anchor to the new email
                }

                setEditingField(null); // Close the text box
                
                // Show the alert reminding them to use the new credentials!
                alert(`Success! Your ${editingField} has been updated. Please use your new ${editingField} the next time you log in.`);
            } else {
                alert("Failed to update profile in database.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error connecting to server.");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const renderFieldRow = (label, fieldKey, isPassword = false) => {
        const isEditing = editingField === fieldKey;

        return (
            <div className="profile-row">
                <div className="profile-label">{label}</div>
                <div className="profile-value">
                    {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
                            <input 
                                type={isPassword && !showPassword ? 'password' : 'text'}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', outline: '2px solid var(--primary-green)' }}
                                autoFocus
                            />
                            <Check size={20} color="var(--primary-green)" style={{ cursor: 'pointer' }} onClick={handleSave} />
                        </div>
                    ) : (
                        <>
                            <span style={{ textDecoration: fieldKey === 'email' ? 'underline' : 'none' }}>
                                {isPassword && !showPassword ? '••••••' : userInfo[fieldKey]}
                            </span>
                            
                            {isPassword && (
                                <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '8px' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                            
                            <Edit size={16} style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleEditClick(fieldKey, userInfo[fieldKey])} />
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <div className="page-header">
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                <h1 className="page-title">User Profile</h1>
            </div>

            <div style={{ flexGrow: 1 }}>
                
                <div className="profile-avatar-container">
                    <div style={{ position: 'relative' }}>
                        
                        <div className="profile-avatar" style={{ overflow: 'hidden' }}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={50} strokeWidth={2} color="#111" />
                            )}
                        </div>

                        {/* --- NEW: REMOVE PHOTO BUTTON --- */}
                        {profileImage && (
                            <button 
                                onClick={() => setProfileImage(null)} 
                                style={{ 
                                    position: 'absolute', top: '-5px', right: '-5px', 
                                    backgroundColor: 'var(--grey-blue)', color: 'var(--grey-blue)', border: 'none', 
                                    borderRadius: '50%', padding: '4px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        )}

                        <label style={{ 
                            position: 'absolute', bottom: '0', right: '-5px', 
                            backgroundColor: 'var(--grey-blue)', borderRadius: '50%', padding: '6px', 
                            display: 'flex', cursor: 'pointer', border: '2px solid var(--bg-blue)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <Camera size={16} color="black" />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                        </label>
                        
                    </div>
                </div>

                <div className="profile-card">
                    {renderFieldRow('Name', 'name')}
                    {renderFieldRow('Email', 'email')}
                    {renderFieldRow('Password', 'password', true)}

                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                </div>
            </div>

            {/* --- SIDEBAR COMPONENT --- */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
    
            {/* BOTTOM NAVIGATION BAR */}
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
                    <User size={26} strokeWidth={2.5} color="var(--primary-green)" />
                    <span style={{ color: 'var(--primary-green)' }}>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;