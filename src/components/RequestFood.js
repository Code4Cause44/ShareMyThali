import React, { useState, useEffect } from 'react';
import '../RequestFood.css';

function RequestFood() {
    const [availableDonations, setAvailableDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [requestForm, setRequestForm] = useState({
        requesterName: '',
        requesterEmail: '',
        requesterPhone: '',
        organizationName: '',
        organizationAddress: '',
        quantityRequested: ''
    });
    const [submissionMessage, setSubmissionMessage] = useState(null);

    useEffect(() => {
        const fetchAvailableDonations = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/requests/available-donations');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setAvailableDonations(data);
            } catch (err) {
                setError('Failed to fetch available donations. Please try again later.');
                console.error('Error fetching available donations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDonations();
    }, []);

    const handleRequestFormChange = (e) => {
        const { name, value } = e.target;
        setRequestForm({ ...requestForm, [name]: value });
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDonation) return;

        // Basic validation
        if (requestForm.quantityRequested <= 0 || requestForm.quantityRequested > selectedDonation.quantityAvailable) {
            alert('Please request a valid quantity within the available amount.');
            return;
        }

        const payload = {
            donationId: selectedDonation._id,
            ...requestForm,
            quantityRequested: parseInt(requestForm.quantityRequested, 10)
        };

        try {
            const res = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSubmissionMessage(`Request for ${selectedDonation.foodType} (${selectedDonation.quantity} servings) submitted successfully!`);
                setShowRequestForm(false);
                setSelectedDonation(null);
                setRequestForm({
                    requesterName: '',
                    requesterEmail: '',
                    requesterPhone: '',
                    organizationName: '',
                    organizationAddress: '',
                    quantityRequested: ''
                });
                const updatedDonations = availableDonations.map(d =>
                    d._id === selectedDonation._id
                        ? { ...d, quantityAvailable: d.quantityAvailable - payload.quantityRequested }
                        : d
                ).filter(d => d.quantityAvailable > 0);
                setAvailableDonations(updatedDonations);

            } else {
                const errorData = await res.json();
                setSubmissionMessage(`Error: ${errorData.message || 'Failed to submit request.'}`);
                console.error('Request submission error:', errorData);
            }
        } catch (err) {
            setSubmissionMessage('Network error: Could not connect to the server.');
            console.error('Network error during request submission:', err);
        }
    };

    const openRequestForm = (donation) => {
        setSelectedDonation(donation);
        setShowRequestForm(true);
    };

    const closeRequestForm = () => {
        setShowRequestForm(false);
        setSelectedDonation(null);
        setRequestForm({
            requesterName: '',
            requesterEmail: '',
            requesterPhone: '',
            organizationName: '',
            organizationAddress: '',
            quantityRequested: ''
        });
        setSubmissionMessage(null);
    };

    if (loading) {
        return <div className="request-food-container">Loading available donations...</div>;
    }

    if (error) {
        return <div className="request-food-container error-message">{error}</div>;
    }

    return (
        <div className="request-food-container">
            <h2 className="page-title">Available Food Donations</h2>
            <p className="page-description">Browse through the food donations available for request by NGOs and organizations.</p>

            {submissionMessage && (
                <div className={`submission-message ${submissionMessage.startsWith('Error') ? 'error' : 'success'}`}>
                    {submissionMessage}
                </div>
            )}

            {availableDonations.length === 0 ? (
                <div className="no-donations">
                    No food donations are currently available for request. Please check back later!
                </div>
            ) : (
                <div className="donations-grid">
                    {availableDonations.map((donation) => (
                        <div key={donation._id} className="donation-card">
                            <h3>{donation.foodType} ({donation.cuisine})</h3>
                            <p><strong>Quantity:</strong> {donation.quantityAvailable} servings</p>
                            <p><strong>Prepared At:</strong> {new Date(donation.preparedAt).toLocaleString()}</p>
                            <p><strong>Location:</strong> {donation.address}, {donation.landmark}</p>
                            <p><strong>Vegetarian:</strong> {donation.vegetarian}</p>
                            {donation.allergens && donation.allergens.length > 0 && (
                                <p><strong>Allergens:</strong> {donation.allergens.join(', ')}</p>
                            )}
                            <button
                                className="request-button"
                                onClick={() => openRequestForm(donation)}
                            >
                                Request Food
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showRequestForm && selectedDonation && (
                <div className="request-modal-overlay">
                    <div className="request-form-modal">
                        <h2>Request "{selectedDonation.foodType}"</h2>
                        <p className="modal-description">Available: {selectedDonation.quantityAvailable} servings</p>

                        <form onSubmit={handleRequestSubmit}>
                            <input
                                type="text"
                                name="requesterName"
                                value={requestForm.requesterName}
                                onChange={handleRequestFormChange}
                                placeholder="Your Name"
                                required
                            />
                            <input
                                type="email"
                                name="requesterEmail"
                                value={requestForm.requesterEmail}
                                onChange={handleRequestFormChange}
                                placeholder="Your Organization Email"
                                required
                            />
                            <input
                                type="tel"
                                name="requesterPhone"
                                value={requestForm.requesterPhone}
                                onChange={handleRequestFormChange}
                                placeholder="Contact Phone"
                                required
                            />
                             <input
                                type="text"
                                name="organizationName"
                                value={requestForm.organizationName}
                                onChange={handleRequestFormChange}
                                placeholder="Organization Name"
                                required
                            />
                            <textarea
                                name="organizationAddress"
                                value={requestForm.organizationAddress}
                                onChange={handleRequestFormChange}
                                placeholder="Organization Address"
                                required
                            />
                            <input
                                type="number"
                                name="quantityRequested"
                                value={requestForm.quantityRequested}
                                onChange={handleRequestFormChange}
                                placeholder={`Quantity (max ${selectedDonation.quantityAvailable})`}
                                min="1"
                                max={selectedDonation.quantityAvailable}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" className="submit-request-btn">Submit Request</button>
                                <button type="button" className="cancel-request-btn" onClick={closeRequestForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestFood;