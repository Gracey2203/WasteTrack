import React, { useState } from 'react';
import { ChevronLeft, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    // Main screen state
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Modal state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Feedback states
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');

    const handleResetClick = (e) => {
        e.preventDefault();
        if (email) {
            setShowModal(true); // Open the modal if an email is typed
        }
    };

    const handleSavePassword = async () => {
        setModalError('');
        setModalSuccess('');

        // 1. Validate Password (Exactly 6 chars, uppercase, lowercase, symbol)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6}$/;
        if (!passwordRegex.test(newPassword)) {
            setModalError("Password must be exactly 6 characters, including a capital letter, a lowercase letter, and a symbol.");
            return;
        }

        // 2. Check if passwords match
        if (newPassword !== confirmPassword) {
            setModalError("Passwords do not match.");
            return;
        }

        // 3. Send to Flask Backend
        try {
            const response = await fetch('http://192.168.0.8:5000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, new_password: newPassword })
            });
            
            const data = await response.json();

            if (response.status === 200) {
                setModalSuccess("Password successfully updated!");
            } else {
                setModalError(data.message || "Failed to update password. Check email.");
            }
        } catch (error) {
            setModalError("Error connecting to server.");
        }
    };

    return (
        <div className="mobile-container">
            {/* --- Main Screen --- */}
            <ChevronLeft size={28} style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate(-1)} />
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>Recreate Password</h2>
                <p style={{ fontSize: '0.85rem', color: '#000000', margin: '0 auto', maxWidth: '280px' }}>
                    Enter your email address and a message will appear to reset then save your new password.
                </p>
            </div>

            <form onSubmit={handleResetClick} style={{ flexGrow: 1 }}>
                <input 
                    type="email" 
                    placeholder="Email (you@example.com)" 
                    className="styled-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <button type="submit" className="green-button" style={{ marginTop: '10px' }}>
                    Reset password
                </button>
            </form>

            {/* --- New Password Modal --- */}
            {showModal && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: '#91acc8', padding: '20px', borderRadius: '15px', 
                        textAlign: 'center', position: 'relative', width: '100%', maxWidth: '350px'
                    }}>
                        <X 
                            size={20} 
                            style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer' }} 
                            onClick={() => {
                                setShowModal(false);
                                setModalSuccess('');
                                setModalError('');
                            }}
                        />
                        <h2 style={{ margin: '10px 0 20px 0', fontSize: '1.5rem' }}>New password</h2>
                        
                        {/* Create Password Input */}
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create password" 
                                maxLength="6"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ 
                                    width: '100%', padding: '15px', borderRadius: '10px', border: 'none', 
                                    backgroundColor: '#64d493', /* Light green matching your mockup */
                                    boxSizing: 'border-box'
                                }} 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '15px', background: 'none', border: 'none' }}>
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm password" 
                                maxLength="6"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ 
                                    width: '100%', padding: '15px', borderRadius: '10px', border: 'none', 
                                    backgroundColor: '#64d493', 
                                    boxSizing: 'border-box'
                                }} 
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '15px', background: 'none', border: 'none' }}>
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        {/* Feedback Messages */}
                        {modalError && <p style={{ color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0' }}>{modalError}</p>}
                        {modalSuccess && <p style={{ color: 'green', fontSize: '0.9rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>{modalSuccess}</p>}

                        <button 
                            onClick={handleSavePassword}
                            style={{ 
                                backgroundColor: '#64d493', border: 'none', borderRadius: '20px', 
                                padding: '10px 30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '15px'
                            }}
                        >
                            Save
                        </button>

                        <button 
                            className="green-button" 
                            style={{ margin: 0, padding: '10px 30px', fontSize: '0.9rem'}}
                            onClick={() => navigate('/login')}
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;