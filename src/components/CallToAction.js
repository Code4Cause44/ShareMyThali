// CallToAction.js
import React from 'react';
import '../App.css';

function CallToAction() {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
          alt="hand heart"
          className="cta-icon"
        />
        <h2>
          <span className="highlight">Be the reason</span> someone smiles today
        </h2>
        <p>
          Every leftover counts. Join our mission to feed the hungry and reduce food waste.
        </p>
        <button className="cta-button">🍽️ Become a Donor</button>
      </div>
      {/* Decorative Background */}
      <div className="cta-decor">
        <img src="https://cdn-icons-png.flaticon.com/512/590/590682.png" alt="leaf" className="leaf-icon" />
        <img src="https://cdn-icons-png.flaticon.com/512/590/590684.png" alt="chili" className="chili-icon" />
        <img src="https://cdn-icons-png.flaticon.com/512/590/590685.png" alt="tomato" className="tomato-icon" />
      </div>
    </section>
  );
}

export default CallToAction;
