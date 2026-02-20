import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import the icons
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isSuccess, setIsSuccess] = useState(false); // New state to track success

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSuccess(false); // Reset success state on new attempt
        try {
            // Because of the "proxy" in package.json, we don't need the full URL
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            setMessage(data.message);

            // Change the check to accept both 200 (OK) and 201 (Created)
            if (response.status === 201 || response.status === 200) {
                setIsSuccess(true);
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Register for WasteTrack</h2>
        <form onSubmit={handleSubmit}>
            <input 
                name="name" 
                placeholder="Name" 
                onChange={handleChange} 
                style={{ marginBottom: '10px', width: '250px', padding: '8px', boxSizing: 'border-box' }}
                required 
            /><br/>
            <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                onChange={handleChange} 
                style={{ marginBottom: '10px', width: '250px', padding: '8px', boxSizing: 'border-box' }}
                required 
            /><br/>
            
            {/* Centered Password Box with Eye */}
            <div style={{ position: 'relative', width: '250px', margin: '0 auto 10px auto' }}>
                <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px', paddingRight: '40px', boxSizing: 'border-box' }}
                    required 
                />
                <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
            
            <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer', marginBottom: '10px' }}>Register</button>
            <br />
            <Link to="/" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none' }}>Back to Home</Link>
        </form>

        {/* This is the part that was missing or in the wrong place */}
        {message && (
            <div style={{ marginTop: '15px' }}>
                <p>{message}</p>
                {isSuccess && (
                    <Link to="/login" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold' }}>
                        Click here to Login now
                    </Link>
                )}
            </div>
        )}
    </div>
    );
};

export default Register;