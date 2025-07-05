import React, { useState, useEffect } from 'react';
import '../DonateFood.css';
import MapComponent from './MapComponent';

function DonationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    foodType: '',
    cuisine: '',
    quantity: '',
    vegetarian: '',
    preparedAt: '',
    hygienic: false,
    allergens: [],
    pickupTime: '',
    agreement: false
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
    if (!form.agreement) {
      alert("Please agree to the food safety terms before submitting.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert('Thank you for your donation!');
        
        updateStats(form.quantity);
        
        setDonationSubmitted(true);
        const now = Date.now();
        localStorage.setItem('donationSubmitted', 'true');
        localStorage.setItem('submissionTime', now.toString());
        setSubmissionTime(now);
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Error connecting to backend.');
    }
  };

  if (donationSubmitted) {
    return (
      <div className="donation-form">
        <h2>🎉 Thank You for Donating, {form.name}!</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Your food donation has been received. Our rider is on the way 🚴‍♂️
        </p>

        <div style={{
          background: '#fff0ec',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '30px',
          fontSize: '1.2rem'
        }}>
          <strong>Estimated Rider Arrival:</strong> <span style={{ color: '#e63946' }}>{formatTime(countdown)}</span>
        </div>

        <section className="map-section" style={{ marginTop: '40px' }}>
          <h3>Pickup Location</h3>
          <p style={{ marginBottom: '10px', color: '#555' }}>
            Based on the address you provided:
          </p>
          <MapComponent address={form.address} />
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
              🙏 Thank you for making a difference!
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

        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Full Name" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Contact Number" required />
        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Pickup Address" required />
        <input type="text" name="landmark" value={form.landmark} onChange={handleChange} placeholder="Nearby Landmark" />

        <select name="foodType" value={form.foodType} onChange={handleChange} required>
          <option value="">Select Food Type</option>
          <option value="Cooked">Cooked</option>
          <option value="Packaged">Packaged</option>
        </select>

        <input type="text" name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Cuisine Type (e.g., North Indian, Chinese)" />
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Approx. servings" required />

        <label>
          <strong>Is the food vegetarian?</strong><br />
          <label><input type="radio" name="vegetarian" value="Yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="vegetarian" value="No" onChange={handleChange} /> No</label>
        </label>

        <label>
          <strong>When was the food prepared?</strong>
          <input type="datetime-local" name="preparedAt" value={form.preparedAt} onChange={handleChange} required />
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

        <label>
          <strong>Preferred Pickup Time</strong>
          <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} />
        </label>

        <label>
          <input type="checkbox" name="agreement" checked={form.agreement} onChange={handleChange} />
          I agree to ShareMyThali's food safety and donation policies
        </label>

        <button type="submit" className="submit-btn">Submit Donation</button>
      </form>
    </>
  );
}

export default DonationForm;