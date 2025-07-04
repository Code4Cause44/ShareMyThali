import React from 'react';
import '../App.css';

function Footer() {
  return (
    <footer className="footer-new">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ShareMyThali</h3>
          <p>Connecting hearts through food. Your leftovers can save lives and bring smiles.</p>
        </div>

        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/team">Team</a></li>
            <li><a href="/impact">Impact</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Get Involved</h4>
          <ul>
            <li><a href="/donate">Donate Food</a></li>
            <li><a href="/partner">Partner with Us</a></li>
            <li><a href="/volunteer">Volunteer</a></li>
            <li><a href="/events">Events</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:hello@sharemythali.org">hello@sharemythali.org</a></li>
            <li>+91-9876543210</li>
            <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShareMyThali. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
