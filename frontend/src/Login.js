import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import the icons
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This calls your Flask /login route via the proxy
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();

            if (response.status === 200) {
                // 1. Save the user's name to the browser's memory
                localStorage.setItem('userName', data.user.name);
                
                // 2. Redirect to the dashboard
                navigate('/dashboard');
            } else {
                setMessage(data.message); // Will show "Invalid email or password"
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
    <div style={{ padding: '20px' }}>
        <h2>Login to WasteTrack</h2>
        <form onSubmit={handleSubmit}>
            <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                onChange={handleChange} 
                style={{ marginBottom: '10px', width: '250px', padding: '8px' }}
                required 
            /><br/>

            {/* Container for Password and Eye */}
            <div style={{ 
                position: 'relative', 
                width: '270px',      // Matches the width of Name/Email inputs
                margin: '0 auto 10px auto', // Centers the box (0 top, auto right/left, 10px bottom)
                display: 'block'     // Ensures it behaves as a centered block
            }}>
                <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    onChange={handleChange} 
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        paddingRight: '40px', 
                        boxSizing: 'border-box' // Important: keeps the box from expanding
                    }}
                    required 
                />
                <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#666'
                    }}
                >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>Login</button>
            
            <br />

            {/* The "Back to Home" Link styled as a small button or text */}
            <Link to="/" style={{ 
                fontSize: '0.85rem', 
                color: '#666', 
                textDecoration: 'none', 
                display: 'inline-block', 
                marginTop: '10px',
                borderBottom: '1px dashed #666'
            }}>
                Back to Home
            </Link>
        </form>
        {message && <p>{message}</p>}
    </div>
    );
};

export default Login;