import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import banner from '../../assets/heroimg1.png'; 
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <img
          src={banner}
          alt="Natural wellness and organic lifestyle"
          className="hero-image"
        />
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Live Natural, Stay Healthy
            </h1>
            <p className="hero-description">
              Discover 100% organic and Ayurvedic products for your daily wellness journey.
            </p>
            <Link to="/products" className="hero-cta">
              Shop Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
