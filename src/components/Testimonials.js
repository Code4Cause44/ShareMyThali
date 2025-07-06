import React from 'react';
import Slider from 'react-slick';
import '../App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: 'Riya',
    quote: '“I was able to donate wedding food effortlessly. Amazing work!”',
    emoji: '💖',
  },
  {
    name: 'Ahmed',
    quote: '“Such a simple and impactful platform. Highly recommend.”',
    emoji: '🌟',
  },
  {
    name: 'Neha',
    quote: '“Feels good to make a difference with just leftover food!”',
    emoji: '🍱',
  },
  {
    name: 'Ramesh',
    quote: '“Simple, fast and rewarding way to help someone.”',
    emoji: '🙏',
  },
  {
    name: 'Tina',
    quote: '“The UI is lovely and it just works flawlessly. Kudos!”',
    emoji: '🎉',
  }
];

function Testimony() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="testimony-section">
      <h2 className="testimony-heading">❤️ What Donors Say</h2>
      <Slider {...settings} className="carousel-wrapper">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="emoji">{testimonial.emoji}</div>
            <p className="quote">{testimonial.quote}</p>
            <p className="name">— <strong>{testimonial.name}</strong></p>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default Testimony;