import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">🍽️ ShareMyThali</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li>How It Works</li> 
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li> 
                <li>
                    <Link to="/donate">
                        <button className="btn">Donate Food</button>
                    </Link>
                </li>
                <li>
                    <Link to="/request"> 
                        <button className="btn">Request Food</button>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;