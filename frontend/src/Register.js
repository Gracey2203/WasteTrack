import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Because of the "proxy" in package.json, we don't need the full URL
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register for WasteTrack</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} required /><br/>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br/>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;