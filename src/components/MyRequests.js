import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 
import '../Dashboard.css';

function MyRequests() {
    const { user, token, isAuthenticated, isOrganization, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!isAuthenticated || !isOrganization) {
            alert('You must be logged in as an Organization to view your requests.');
            navigate('/login');
            return;
        }

        const fetchMyRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('http://localhost:5000/api/requests/my-requests', {
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
                setRequests(data);
            } catch (err) {
                console.error('Error fetching my requests:', err);
                setError(err.message || 'Failed to fetch requests. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyRequests();
    }, [isAuthenticated, isOrganization, token, navigate, authLoading]); 

    if (authLoading || loading) {
        return <div className="dashboard-container"><div className="loading-spinner">Loading requests...</div></div>;
    }

    if (error) {
        return <div className="dashboard-container"><div className="error-message">{error}</div></div>;
    }

    if (!isAuthenticated || !isOrganization) {
        return <div className="dashboard-container"><div className="error-message">Access Denied.</div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2>My Requests Dashboard</h2>
                {user && <p className="welcome-message">Hello, {user.username}! Here are the food requests your organization has made.</p>}

                {updateMessage && (
                    <div className={`submission-message ${updateMessage.startsWith('Error') ? 'error' : 'success'}`}>
                        {updateMessage}
                    </div>
                )}

                <div className="dashboard-content">
                    {requests.length === 0 ? (
                        <p>Your organization hasn't made any food requests yet. Browse <Link to="/request">available donations</Link>!</p>
                    ) : (
                        <div className="requests-list">
                            {requests.map(request => (
                                <div key={request._id} className="request-item-card">
                                    <h3>Request for "{request.donation.foodType}" ({request.donation.cuisine})</h3>
                                    <p><strong>Requested Quantity:</strong> {request.quantityRequested} servings</p>
                                    <p><strong>Donation Original Quantity:</strong> {request.donation.quantity} servings</p>
                                    <p><strong>Status:</strong> <span className={`status-badge status-${request.status.toLowerCase().replace(/\s/g, '-')}`}>{request.status}</span></p>
                                    <p><strong>Donation Prepared:</strong> {new Date(request.donation.preparedAt).toLocaleString()}</p>
                                    <p><strong>Donor:</strong> {request.donation.donor.username} ({request.donation.donor.email})</p>
                                    <p><strong>Donor Address:</strong> {request.donation.donor.address}, {request.donation.donor.landmark}</p>
                                    {request.donation.allergens && request.donation.allergens.length > 0 && (
                                        <p><strong>Allergens:</strong> {request.donation.allergens.join(', ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyRequests;