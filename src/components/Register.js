import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../AuthForms.css'; 

function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'donor', 
        organizationName: '',
        organizationAddress: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                login(data, data.token); 
                alert(data.message);
                navigate('/');
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />

                    <label className="role-select-label">
                        Register as:
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="donor">Donor</option>
                            <option value="organization">Organization</option>
                        </select>
                    </label>

                    {form.role === 'organization' && (
                        <>
                            <input
                                type="text"
                                name="organizationName"
                                value={form.organizationName}
                                onChange={handleChange}
                                placeholder="Organization Name"
                                required
                            />
                            <textarea
                                name="organizationAddress"
                                value={form.organizationAddress}
                                onChange={handleChange}
                                placeholder="Organization Address"
                                required
                            />
                        </>
                    )}

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="auth-switch-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;