import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() {
    const { isAuthenticated, user, logout, isDonor, isOrganization, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">🍽️ ShareMyThali</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>

                {isAuthenticated ? (
                    <>
                        {isDonor && (
                            <li><Link to="/my-donations">My Donations</Link></li>
                        )}
                        {isOrganization && (
                            <li><Link to="/my-requests">My Requests</Link></li>
                        )}
                        {(isDonor || isAdmin) && (
                            <li>
                                <Link to="/donate">
                                    <button className="btn">Donate Food</button>
                                </Link>
                            </li>
                        )}
                        {(isOrganization || isAdmin) && (
                            <li>
                                <Link to="/request">
                                    <button className="btn">Request Food</button>
                                </Link>
                            </li>
                        )}
                        <li>
                            <button className="btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">
                                <button className="btn">Login</button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register">
                                <button className="btn">Register</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;