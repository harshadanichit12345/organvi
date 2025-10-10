import React from 'react';
import './Hero.css';
import heroImage from '../../assets/heroimage.jpg';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-image-container">
        <img src={heroImage} alt="Organic Products" className="hero-image" />
      </div>
    </section>
  );
};

export default Hero;