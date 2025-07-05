import React, { useState } from 'react';
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

  const allergensList = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs'];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agreement) {
      alert("Please agree to the food safety terms before submitting.");
      return;
    }
    console.log("Form submitted:", form);
    alert("Thank you for your donation!");
  };

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

      <section className="map-section">
        <h2>Confirm Pickup Location on Map</h2>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          You can search and mark the exact address from where our volunteers should collect the food.
        </p>
        <MapComponent />
      </section>
    </>
  );
}

export default DonationForm;
