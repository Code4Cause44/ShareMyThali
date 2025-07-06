import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate ,Link} from 'react-router-dom'; 
import '../Dashboard.css'; 

function MyDonations() {
    const { user, token, isAuthenticated, isDonor, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!isAuthenticated || !isDonor) {
            alert('You must be logged in as a Donor to view your donations.');
            navigate('/login');
            return;
        }

        const fetchMyDonations = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('http://localhost:5000/api/donations/my-donations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error('Unauthorized: Please log in again.');
                    }
                    if (res.status === 403) {
                         throw new Error('Access Denied: You are not authorized to view this page.');
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setDonations(data);
            } catch (err) {
                console.error('Error fetching my donations:', err);
                setError(err.message || 'Failed to fetch donations. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyDonations();
    }, [isAuthenticated, isDonor, token, navigate, authLoading]);

    const handleUpdateDonationStatus = async (donationId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this donation as "${newStatus}"?`)) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/donations/${donationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (res.ok) {
                setDonations(donations.map(d =>
                    d._id === donationId ? { ...d, status: data.status } : d
                ));
                setUpdateMessage(`Donation status updated to "${data.status}" successfully!`);
                setTimeout(() => setUpdateMessage(null), 3000);
            } else {
                setUpdateMessage(`Error updating status: ${data.message || 'Unknown error'}`);
                console.error('Error updating donation status:', data);
            }
        } catch (err) {
            setUpdateMessage('Network error: Could not update donation status.');
            console.error('Network error updating donation status:', err);
        }
    };

    if (authLoading || loading) {
        return <div className="dashboard-container"><div className="loading-spinner">Loading donations...</div></div>;
    }

    if (error) {
        return <div className="dashboard-container"><div className="error-message">{error}</div></div>;
    }

    if (!isAuthenticated || !isDonor) {
        return <div className="dashboard-container"><div className="error-message">Access Denied.</div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2>My Donations Dashboard</h2>
                {user && <p className="welcome-message">Hello, {user.username}! Here are the donations you've made.</p>}

                {updateMessage && (
                    <div className={`submission-message ${updateMessage.startsWith('Error') ? 'error' : 'success'}`}>
                        {updateMessage}
                    </div>
                )}

                <div className="dashboard-content">
                    {donations.length === 0 ? (
                        <p>You haven't made any donations yet. Why not <Link to="/donate">donate some food</Link>?</p>
                    ) : (
                        <div className="donations-list">
                            {donations.map(donation => (
                                <div key={donation._id} className="donation-item-card">
                                    <h3>{donation.foodType} ({donation.cuisine}) - {donation.quantity} servings</h3>
                                    <p>Status: <span className={`status-badge status-${donation.status.toLowerCase().replace(/\s/g, '-')}`}>{donation.status}</span></p>
                                    <p>Prepared: {new Date(donation.preparedAt).toLocaleString()}</p>
                                    <p>Pickup: {donation.pickupTime ? donation.pickupTime : 'Anytime'}</p>
                                    <p>Address: {donation.address}, {donation.landmark}</p>
                                    {donation.requester && donation.requester.organizationName && (
                                        <p>Requested by: {donation.requester.organizationName} ({donation.requester.username})</p>
                                    )}
                                    {donation.allergens && donation.allergens.length > 0 && (
                                        <p>Allergens: {donation.allergens.join(', ')}</p>
                                    )}
                                    <div className="donation-actions">
                                        {donation.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateDonationStatus(donation._id, 'Confirmed')}
                                                    className="action-button confirm-button"
                                                >
                                                    Confirm Pickup
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateDonationStatus(donation._id, 'Cancelled')}
                                                    className="action-button cancel-button"
                                                >
                                                    Cancel Donation
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyDonations;