import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/organvilogo.jpg';
import fssaiLogo from '../../assets/fssai.png';
import rupayLogo from '../../assets/rupay.png';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import upiLogo from '../../assets/upi (1).png';
import addressIcon from '../../assets/address.gif';
import phoneIcon from '../../assets/phoneno.gif';
import emailIcon from '../../assets/email.gif';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="footer">

      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section about-section" style={{overflow: 'visible', height: 'auto'}}>
            <h4 className="footer-title">About Organvi</h4>
            <p className="about-text" style={{display: 'block', visibility: 'visible', opacity: '1', color: 'black', fontSize: '14px', lineHeight: '1.4', margin: '10px 0'}}>
              Organvi is a fast-growing organic food company dedicated to farming, producing, and packing pure, chemical-free products. Through our "Partnership with Farmer" model, we ensure quality and sustainability.
            </p>
            <div className="certification">
              <img src={fssaiLogo} alt="FSSAI Logo" className="fssai-logo" />
              <div className="payment-methods">
                <img src={rupayLogo} alt="RuPay" className="payment-logo" />
                <img src={visaLogo} alt="VISA" className="payment-logo" />
                <img src={mastercardLogo} alt="Mastercard" className="payment-logo" />
                <img src={upiLogo} alt="UPI" className="payment-logo" />
              </div>
            </div>
          </div>

          {/* Navigation and Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            </ul>
            <div className="newsletter">
              <h5 className="newsletter-title">Newsletter</h5>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="E-mail address"
                  className="newsletter-input"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <button 
                  type="submit" 
                  className="newsletter-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </form>
              {isSubscribed && (
                <div className="newsletter-success">
                  <p>✅ Thank you for subscribing to our newsletter!</p>
                </div>
              )}
            </div>
          </div>

          {/* Policies and Social Media */}
          <div className="footer-section policies-section">
            <h4 className="footer-title">Policies</h4>
            <ul className="footer-list">
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms and Condition</Link></li>
              <li><Link to="/returns" className="footer-link">Returns and Refund</Link></li>
              <li><Link to="/shipping" className="footer-link">Shipping Policy</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section contact-section">
            <h4 className="footer-title">Visit Us</h4>
            <div className="company-info">
             
              <div className="contact-details">
                <div className="contact-item">
                  <img src={addressIcon} alt="Address" className="contact-icon" />
                  <span>Sr No 61, 1/ B, Nalegaon Road, near Govt Rest House, Malkapur, Udgir, Maharashtra 413517</span>
                </div>
                <div className="contact-item contact-email">
                  <img src={emailIcon} alt="Email" className="contact-icon" />
                  <span>organviagro@gmail.com</span>
                </div>
                  <div className="contact-item contact-phone">
                    <img src={phoneIcon} alt="Phone" className="contact-icon" />
                    <span>+91 9175580173/ 9284361797</span>
                  </div>
                
              </div>
            </div>
            <div className="social-section">
              <h5 className="social-title">Follow Us</h5>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/organvi2021/?igsh=MW00cWsxZTE5ajV6aw%3D%3D" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">Organvi© Copyright 2025</p>
          <p className="designer-credit">designed by team intellisys</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;