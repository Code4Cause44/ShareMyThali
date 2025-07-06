import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../AuthForms.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        console.log('Before login - isAuthenticated:', isAuthenticated);
        console.log('Before login - user:', user);
        
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log('API Response:', data);

            if (res.ok) {
                const { token, message, ...userData } = data;
                
                console.log('User data being passed to login:', userData);
                console.log('Token being passed to login:', token);
                
                login(userData, token);
                setTimeout(() => {
                    console.log('After login - isAuthenticated:', isAuthenticated);
                    console.log('After login - user:', user);
                }, 100);
                
                alert(data.message);
                navigate('/');
            } else {
                setError(data.message || 'Login failed. Please check your credentials again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" style={{textAlign: 'left'}}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password" style={{textAlign: 'left'}}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-switch-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;