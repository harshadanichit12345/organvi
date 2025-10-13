import React, { useState, useEffect } from 'react';
import './Hero.css';
import heroImage from '../../assets/heroimage.jpg';
import coffeeImage from '../../assets/Coffee.png';
import hero3Image from '../../assets/hero3.png';
import hero4Image from '../../assets/hero 4.png';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [coffeeImage, hero3Image, hero4Image, heroImage];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After slide out animation completes, change image
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400); // Half of transition duration
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero">
      <div className="hero-image-container">
        {images.map((image, index) => {
          const isActive = index === currentImage;
          const isPrevious = index === (currentImage - 1 + images.length) % images.length;
          const shouldSlideOut = isPrevious && isTransitioning;
          
          return (
            <img
              key={index}
              src={image}
              alt={index === 0 ? "Coffee" : index === 1 ? "Hero Product 3" : index === 2 ? "Hero Product 4" : "Organic Products"}
              className={`hero-image ${isActive ? 'active' : ''} ${shouldSlideOut ? 'slide-out' : ''}`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Hero;