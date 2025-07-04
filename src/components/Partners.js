import React from 'react';
import '../App.css';

const ngoPartners = [
  { name: 'HelpingHands', logo: '/images/ngos/ngo1.png' },
  { name: 'FoodRelief', logo: '/images/ngos/ngo2.png' },
  { name: 'Care4All', logo: '/images/ngos/ngo3.png' },
  { name: 'MealMission', logo: '/images/ngos/ngo4.png' }
];

const Partners = () => {
  return (
    <section className="partners-section">
      <h2 className="partners-title">🤝 Our NGO Partners</h2>
      <p className="partners-subtitle">We collaborate with these amazing organizations to make food reach the right hands.</p>
      <div className="partner-logos">
        {ngoPartners.map((ngo, index) => (
          <div className="logo-card" key={index}>
            <img src={ngo.logo} alt={ngo.name} />
            <span>{ngo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
