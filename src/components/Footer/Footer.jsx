import { Package, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/organvilogo.jpg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-logo-section">
            <img src={logo} alt="Logo" className="footer-logo" />
          </div>


          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/products" className="footer-link">All Products</Link></li>
                <li><Link to="/categories" className="footer-link">Categories</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-list">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                <li><Link to="/returns" className="footer-link">Return & Refund Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-list">
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="footer-link">Shipping Policy</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/support" className="footer-link">Support</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
              <div className="newsletter">
                <h5 className="newsletter-title">Subscribe to Newsletter</h5>
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 Organvi. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms</Link>
              <Link to="/cookies" className="footer-bottom-link">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;