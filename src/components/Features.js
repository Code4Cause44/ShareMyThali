import React from 'react';
import '../App.css';

const features = [
  {
    title: 'Quick Pickup',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    description: 'Volunteers collect food fast to avoid spoilage.'
  },
  {
    title: 'Track Donations',
    image: 'https://cdn-icons-png.flaticon.com/512/1246/1246361.png',
    description: 'Get updates on when your food is picked and delivered.'
  },
  {
    title: 'NGO Verified',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    description: 'We partner with verified NGOs to ensure safe distribution.'
  },
  {
    title: 'Join Drives',
    image: 'https://cdn-icons-png.flaticon.com/512/3271/3271314.png',
    description: 'Participate in food donation events near you.'
  },
  {
    title: 'Earn Badges',
    image: 'https://cdn-icons-png.flaticon.com/512/3132/3132087.png',
    description: 'Get recognized for your regular contributions.'
  },
  {
    title: 'Eco Friendly',
    image: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
    description: 'Reduce waste and help the environment too!'
  }
];

function Features() {
  return (
    <section className="features">
      <h2>Why Use ShareMyThali?</h2>
      <p className="subtitle">Features designed to help you donate food easily and responsibly</p>
      <div className="circle-container">
        <img src="/images/laptop.png" alt="Laptop" className="central-img" />

        {features.map((feat, index) => (
          <div key={index} className={`circle-icon circle-${index}`}>
            <img src={feat.image} alt={feat.title} />
            <p>{feat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;