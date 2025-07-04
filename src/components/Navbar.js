import React from 'react';
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🍽️ ShareMyThali</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>How It Works</li>
        <li>About Us</li>
        <li>Contact</li>
        <button className="btn">Donate Food</button>
      </ul>
    </nav>
  );
}
export default Navbar;