import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🍽️ ShareMyThali</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>How It Works</li>
        <li>About Us</li>
        <li>Contact</li>
        <Link to="/donate">
          <button className="btn">Donate Food</button>
        </Link>
      </ul>
    </nav>
  );
}
export default Navbar;