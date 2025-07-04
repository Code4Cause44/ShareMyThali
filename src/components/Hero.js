import React from 'react';
import '../App.css';

function Hero() {
  return (
    <section className="hero-section">
      <div className="decorative-images">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          alt="burger"
          className="floating burger"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/5787/5787093.png"
          alt="pizza"
          className="floating pizza"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/590/590685.png"
          alt="tomato"
          className="floating tomato"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/590/590682.png"
          alt="leaf"
          className="floating leaf"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/590/590684.png"
          alt="chili"
          className="floating chili"
        />

      </div>
      <div className="hero-content">
        <h1>Better food for more people</h1>
        <p>
          Share your leftovers and make someone’s day. Let’s build a community
          where no food goes to waste.
        </p>
      </div>

      <div className="hero-stats">
          <div className="stat-item">
            <h2>10,000+</h2>
            <p>Meals Shared</p>
            <img src="https://cdn-icons-png.flaticon.com/512/2983/2983791.png" alt="meals" />
          </div>
          <div className="stat-item">
            <h2>1,500+</h2>
            <p>Donors Registered</p>
            <img src="https://cdn-icons-png.flaticon.com/512/1063/1063376.png" alt="donors" />
          </div>
          <div className="stat-item">
            <h2>200+</h2>
            <p>NGO Partners</p>
            <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="NGOs" />
          </div>
        </div>
    </section>
  );
}

export default Hero;