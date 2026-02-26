import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // New states for terms checkbox and error messages
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error on new submission

    // 1. Check if terms are accepted
    if (!termsAccepted) {
        setError("You must agree to the Terms & services to register.");
        return;
    }

    // 2. Validate Password matches conditions
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6}$/;
    if (!passwordRegex.test(formData.password)) {
        setError("Password must be exactly 6 characters, including a capital letter, a lowercase letter, and a symbol.");
        return;
    }

    // 3. Check if passwords match
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    // 4. Send the valid data to your Flask backend
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // We only send name, email, and password to the database
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }), 
        });
        
        const data = await response.json();

        // 5. If registration is successful, go straight to the Login page!
        if (response.status === 201 || response.status === 200) {
            navigate('/login'); 
        } else {
            // If the backend sends an error (like "Email already exists")
            setError(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        setError("Error connecting to server.");
    }
};

    return (
        <div className="mobile-container">
            <ChevronLeft size={28} style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate(-1)} />
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>Create Account</h2>
                <p style={{ fontSize: '0.85rem', color: '#000000', margin: 0 }}>New here? Register & unlock a great amount of features!</p>
            </div>

            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" className="styled-input" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email (you@example.com)" className="styled-input" onChange={handleChange} required />

                <div style={{ position: 'relative' }}>
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Create password" className="styled-input" onChange={handleChange} maxLength="6" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none' }}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <div style={{ position: 'relative' }}>
                    <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" className="styled-input" onChange={handleChange} maxLength="6" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none' }}>
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', marginBottom: '10px' }}>
                    <input 
                        type="checkbox" 
                        onChange={(e) => setTermsAccepted(e.target.checked)} 
                    />
                    <span>
                        I agree to all statements in{' '}
                        {/* 3. External link opening in a new tab */}
                        <a 
                            href="https://www.ppbgroup.com/governance-sustainability/code-policies/waste-management-policy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#000000', fontWeight: 'bold' }}
                        >
                            Terms & services
                        </a>
                    </span>
                </label>

                {/* Display validation errors if there are any */}
                {error && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 15px 0' }}>{error}</p>}

                <button type="submit" className="green-button">Register</button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '10px' }}>
                Already have an account? <Link to="/login" style={{ fontWeight: 'bold', color: '#000000', textDecoration: 'none' }}>Login here</Link>
            </p>
        </div>
    );
};

export default Register;