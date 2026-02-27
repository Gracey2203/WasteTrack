import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    // New states for our logic
    const [error, setError] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [rememberMe, setRememberMe] = useState(false);

    // 3. Load saved credentials when the page opens
    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        if (savedEmail && savedPassword) {
            setFormData({ email: savedEmail, password: savedPassword });
            setRememberMe(true);
        }
    }, []);

    // Add this new function to handle the checkbox toggle
    const handleRememberMeToggle = (e) => {
        const isChecked = e.target.checked;
        setRememberMe(isChecked); // Update the checkbox visual state

        if (isChecked) {
            // If ticked: Look in memory and fill the boxes if data exists
            const savedEmail = localStorage.getItem('savedEmail');
            const savedPassword = localStorage.getItem('savedPassword');
            if (savedEmail && savedPassword) {
                setFormData({ email: savedEmail, password: savedPassword });
            }
        } else {
            // If unticked: Clear the boxes immediately
            setFormData({ email: '', password: '' });
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Send data to Flask to verify against the database
            const response = await fetch('http://192.168.0.8:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();

            if (response.status === 200) {
                // Save the user's name for the dashboard
                localStorage.setItem('userName', data.user.name || 'User');
                
                // 3. Save or clear credentials based on "Remember me"
                if (rememberMe) {
                    localStorage.setItem('savedEmail', formData.email);
                    localStorage.setItem('savedPassword', formData.password);
                } else {
                    localStorage.removeItem('savedEmail');
                    localStorage.removeItem('savedPassword');
                }

                navigate('/home'); 
            } else {
                // If password doesn't match, backend sends an error
                setError(data.message || "Invalid email or password.");
                // 2. Add a strike to the failed attempts counter
                setFailedAttempts(prev => prev + 1);
            }
        } catch (error) {
            console.error("THE REAL ERROR IS:", error);
            setError("Error connecting to server.");
        }
    };

    return (
        <div className="mobile-container">
            <ChevronLeft size={28} style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate(-1)} />
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>Welcome back!</h2>
                <p style={{ fontSize: '0.85rem', color: '#000000', margin: 0 }}>Login to start using your features!</p>
            </div>

            <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
                <input 
                    name="email" 
                    type="email" 
                    value={formData.email} // Important: Bind value to state
                    placeholder="Email (you@example.com)" 
                    className="styled-input"
                    onChange={handleChange} 
                    required 
                />

                <div style={{ position: 'relative' }}>
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password} // Important: Bind value to state
                        placeholder="Password" 
                        className="styled-input"
                        onChange={handleChange} 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', color: '#333' }}
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={handleRememberMeToggle} 
                        /> Remember me
                    </label>
                    <Link to="/forgot-password" style={{ color: '#000000', textDecoration: 'underline' }}>
                        Forgot password
                    </Link>
                </div>

                {/* 1. Display standard error message */}
                {error && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 10px 0' }}>{error}</p>}

                {/* 2. Display specific "Forgot Password" prompt after 3 strikes */}
                {failedAttempts >= 3 && (
                    <div style={{ backgroundColor: '#ffcccc', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#a00' }}>
                            Having trouble? <Link to="/forgot-password" style={{ fontWeight: 'bold', color: '#a00' }}>Click here to reset your password.</Link>
                        </p>
                    </div>
                )}

                <button type="submit" className="green-button">Login</button>
            </form>
        </div>
    );
};

export default Login;