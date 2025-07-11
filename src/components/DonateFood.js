import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../DonateFood.css';
import MapComponent from './MapComponent';

function DonateFood() {
    const { isAuthenticated, user, isDonor, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        foodType: '',
        cuisine: '',
        quantity: '',
        vegetarian: '',
        preparedAt: '',
        hygienic: false,
        allergens: [],
        pickupTime: '',
        agreement: false,
        phone: '',
        address: '',
        landmark: '',
    });

    const [donationSubmitted, setDonationSubmitted] = useState(() => {
        return localStorage.getItem('donationSubmitted') === 'true';
    });

    const [submissionTime, setSubmissionTime] = useState(() => {
        const stored = localStorage.getItem('submissionTime');
        return stored ? parseInt(stored, 10) : null;
    });

    const [countdown, setCountdown] = useState(() => {
        const storedTime = localStorage.getItem('submissionTime');
        if (storedTime) {
            const elapsed = Math.floor((Date.now() - parseInt(storedTime, 10)) / 1000);
            return Math.max(30 * 60 - elapsed, 0);
        }
        return 30 * 60;
    });

    const [stats, setStats] = useState({
        totalDonations: 0,
        totalServings: 0,
        livesImpacted: 0,
        donationsToday: 0
    });

    const allergensList = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs'];
    
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isDonor)) {
            alert('You must be logged in as a Donor to donate food.');
            navigate('/login'); 
        }
    }, [isAuthenticated, isDonor, authLoading, navigate]);
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                phone: user.phone || '',
                address: user.address || '',
                landmark: user.landmark || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        const savedStats = localStorage.getItem('donationStats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    const updateStats = (quantity) => {
        const newStats = {
            totalDonations: stats.totalDonations + 1,
            totalServings: stats.totalServings + parseInt(quantity || 0),
            livesImpacted: stats.livesImpacted + parseInt(quantity || 0),
            donationsToday: stats.donationsToday + 1
        };

        setStats(newStats);
        localStorage.setItem('donationStats', JSON.stringify(newStats));
    };
    
    useEffect(() => {
        if (donationSubmitted && submissionTime) {
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - submissionTime) / 1000);
                const remaining = 30 * 60 - elapsed;
                setCountdown(remaining > 0 ? remaining : 0);

                if (remaining <= 0) {
                    clearInterval(timer);
                    localStorage.removeItem('donationSubmitted');
                    localStorage.removeItem('submissionTime');
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [donationSubmitted, submissionTime]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'allergens') {
            setForm((prev) => {
                const updated = checked
                    ? [...prev.allergens, value]
                    : prev.allergens.filter((a) => a !== value);
                return { ...prev, allergens: updated };
            });
        } else if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.phone.trim()) {
            alert("Please enter your contact number.");
            return;
        }
        if (!form.address.trim()) {
            alert("Please enter your pickup address.");
            return;
        }
        
        if (!form.agreement) {
            alert("Please agree to the food safety terms before submitting.");
            return;
        }
        const preparedDate = new Date(form.preparedAt);
        if (preparedDate > new Date()) {
            alert("Prepared time cannot be in the future.");
            return;
        }

        if (parseInt(form.quantity) <= 0) {
            alert("Quantity must be a positive number.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                navigate('/login');
                return;
            }

            const res = await fetch('http://localhost:5000/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form) 
            });

            const data = await res.json();

            if (res.ok) {
                alert('Thank you for your donation!');
                updateStats(form.quantity);

                setDonationSubmitted(true);
                const now = Date.now();
                localStorage.setItem('donationSubmitted', 'true');
                localStorage.setItem('submissionTime', now.toString());
                setSubmissionTime(now);

            } else {
                alert(`Error submitting donation: ${data.message || 'Something went wrong.'}`);
                console.error('Donation submission error:', data);
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Error connecting to backend.');
        }
    };

    if (authLoading || (!isAuthenticated && !authLoading)) {
        return <div className="donation-form-container">Checking authentication...</div>;
    }
    
    if (donationSubmitted) {
        return (
            <div className="donation-form donation-success-container"> 
                <h2>🎉 Thank You for Donating!</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Your food donation has been received. Our rider is on the way 
                </p>

                <div className="countdown-display"> 
                    <strong>Estimated Rider Arrival:</strong> <span>{formatTime(countdown)}</span>
                </div>

                <section className="map-section">
                    <h3>Pickup Location</h3>
                    <p style={{ marginBottom: '10px', color: '#555' }}>
                        Based on your registered address:
                    </p>
                    <MapComponent address={form.address || 'Your registered address'} />
                </section>

                <section className="donation-stats">
                    <h3 className="stats-title">
                        Your Impact & Community Stats
                    </h3>

                    <div className="stats-grid">
                        <div className="stat-card stat-card-purple">
                            <div className="stat-number">
                                {stats.totalDonations}
                            </div>
                            <div className="stat-label">
                                Total Donations
                            </div>
                        </div>

                        <div className="stat-card stat-card-pink">
                            <div className="stat-number">
                                {stats.totalServings}
                            </div>
                            <div className="stat-label">
                                Total Servings
                            </div>
                        </div>

                        <div className="stat-card stat-card-blue">
                            <div className="stat-number">
                                {stats.livesImpacted}
                            </div>
                            <div className="stat-label">
                                Lives Impacted
                            </div>
                        </div>

                        <div className="stat-card stat-card-orange">
                            <div className="stat-number">
                                {stats.donationsToday}
                            </div>
                            <div className="stat-label">
                                Donations Today
                            </div>
                        </div>
                    </div>

                    <div className="contribution-highlight">
                        <h4 className="contribution-title">
                            🌟 Your Contribution Today
                        </h4>
                        <p className="contribution-text">
                            You've contributed <strong>{form.quantity} servings</strong> of {form.foodType.toLowerCase()} food,
                            potentially feeding <strong>{form.quantity} people</strong> in need!
                        </p>
                    </div>

                    <div className="motivational-message">
                        <h4 className="motivational-title">
                            🙏 Thank you for making a huge difference!
                        </h4>
                        <p className="motivational-text">
                            Every donation counts. Together, we're building a community where no one goes hungry.
                            Your kindness creates a ripple effect of positive change.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <>
            <form className="donation-form" onSubmit={handleSubmit}>
                <h2>Donate Food</h2>
                <input type="text" name="name" value={user?.username || ''} placeholder="Your Full Name" readOnly />
                <input type="email" name="email" value={user?.email || ''} placeholder="Email Address" readOnly />
                <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange}
                    placeholder="Contact Number" 
                    required 
                />
                <textarea 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange}
                    placeholder="Pickup Address" 
                    required 
                />
                <input 
                    type="text" 
                    name="landmark" 
                    value={form.landmark} 
                    onChange={handleChange}
                    placeholder="Nearby Landmark" 
                />

                <select name="foodType" value={form.foodType} onChange={handleChange} required>
                    <option value="">Select Food Type</option>
                    <option value="Cooked">Cooked</option>
                    <option value="Packaged">Packaged</option>
                </select>

                <input type="text" name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Cuisine Type (e.g., North Indian, Chinese)" />
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Approx. servings" required min="1" />

                <label>
                    <strong>Is the food vegetarian?</strong><br />
                    <label><input type="radio" name="vegetarian" value="Yes" onChange={handleChange} checked={form.vegetarian === 'Yes'} required/> Yes</label>
                    <label><input type="radio" name="vegetarian" value="No" onChange={handleChange} checked={form.vegetarian === 'No'} /> No</label>
                </label>

                <label className="input-label-with-time"> 
                    <strong>When was the food prepared?</strong>
                    <input type="datetime-local" name="preparedAt" value={form.preparedAt} onChange={handleChange} required max={new Date().toISOString().slice(0,16)} />
                </label>

                <label>
                    <input type="checkbox" name="hygienic" checked={form.hygienic} onChange={handleChange} />
                    I confirm the food was stored hygienically
                </label>

                <label><strong>Contains any allergens?</strong></label>
                <div className="allergen-checkboxes">
                    {allergensList.map((allergen) => (
                        <label key={allergen}>
                            <input
                                type="checkbox"
                                name="allergens"
                                value={allergen}
                                checked={form.allergens.includes(allergen)}
                                onChange={handleChange}
                            />
                            {allergen}
                        </label>
                    ))}
                </div>

                <label className="input-label-with-time">
                    <strong>Preferred Pickup Time</strong>
                    <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} />
                </label>

                <label className="agreement-checkbox">
                    <input type="checkbox" name="agreement" checked={form.agreement} onChange={handleChange} required/>
                    I agree to ShareMyThali's food safety and donation policies
                </label>

                <button type="submit" className="submit-btn">Submit Donation</button>
            </form>
        </>
    );
}

export default DonateFood;