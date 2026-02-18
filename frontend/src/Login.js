import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

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
                setMessage(`Welcome back, ${data.user.name}!`);
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
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br/>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;