import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/organvilogo.jpg';
import fssaiLogo from '../../assets/fssai.png';
import rupayLogo from '../../assets/rupay.png';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import upiLogo from '../../assets/upi (1).png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">

      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section about-section">
            <h4 className="footer-title">About Organvi</h4>
            <p className="about-text">
              Organvi is a certified organic farming and food processing company working in partnership with farmers to deliver pure, natural, and chemical-free products.
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
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="E-mail address"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">SUBSCRIBE</button>
              </div>
            </div>
          </div>

          {/* Policies and Social Media */}
          <div className="footer-section policies-section">
            <h4 className="footer-title">Policies</h4>
            <ul className="footer-list">
              <li><Link to="/partner" className="footer-link">Profit by Partnering</Link></li>
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
                  <MapPin size={20} />
                  <span>Sr No 61, 1/ B, Nalegaon Road, near Govt Rest House, Malkapur, Udgir, Maharashtra 413517</span>
                </div>
                <div className="contact-item">
                  <Mail size={20} />
                  <span>organviagro@gmail.com</span>
                </div>
                  <div className="contact-item contact-phone">
                    <Phone size={20} />
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
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">Organvi© Copyright 2025</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;