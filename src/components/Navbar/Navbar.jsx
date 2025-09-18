import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
  UserPlus,
  Tag,
  ArrowRight,
  Home,
  Heart,
  Bell,
  Package,
  MessageCircle,
  Instagram,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/organvilogo.jpg';
import LoginModal from '../../pages/LoginModal/LoginModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const location = useLocation();

  // Function to add a notification (for testing)
  const addNotification = () => {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const newNotification = {
      id: Date.now(),
      message: 'New notification',
      timestamp: new Date().toISOString()
    };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setNotificationCount(notifications.length);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = cart.length; // Count unique products, not quantities
      console.log('Navbar cart count update:', uniqueItems, 'Cart items:', cart);
      setCartCount(uniqueItems);
    };
    
    const handleCartUpdated = (event) => {
      console.log('Navbar received cartUpdated event:', event.detail);
      setCartCount(event.detail);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistCount(wishlist.length);
    };
    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    return () => window.removeEventListener('storage', updateWishlistCount);
  }, []);

  useEffect(() => {
    const updateNotificationCount = () => {
      const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      setNotificationCount(notifications.length);
    };
    updateNotificationCount();
    window.addEventListener('storage', updateNotificationCount);
    return () => window.removeEventListener('storage', updateNotificationCount);
  }, []);



  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="row-main">
            <div className="left-group">
              <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link to="/" className="brand">
                <img src={logo} alt="Organvi" />
              </Link>
            </div>

            <div className="search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
              />
            </div>

            <div className="right-group">
              <div className="deliver" onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
                <MapPin size={30} />
                <div className="deliver-text">
                  <span className="label">Deliver to</span>
                  <span className="value">Pune 411057</span>
                </div>
                <ChevronDown size={16} />
              </div>

              <div className="account" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                <User size={30} />
                <div className="account-text">
                  <span className="label">Hello, User</span>
                  <span className="value">Account & Lists</span>
                </div>
              </div>

              <button className="btn outline" onClick={() => setShowLoginModal(true)}>
                <UserPlus size={18} />
                Sign up
              </button>

              <button className="notification-btn">
                <Bell size={25} />
              </button>

              <Link to="/addcart" className="cart">
                <ShoppingCart size={25} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>

              <button className="btn offers">
                <Tag size={16} />
                Offers
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Location Dropdown Popup */}
      {showLocationDropdown && (
        <div className="location-dropdown-overlay" onClick={() => setShowLocationDropdown(false)}>
          <div className="location-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="location-dropdown-content">
              <button 
                className="search-area-btn" 
                onClick={() => setShowSearchArea(!showSearchArea)}
              >
                + Search new area
              </button>
              
              {showSearchArea && (
                <div className="search-area-container">
                  <input
                    type="text"
                    placeholder="Search your area/ apartment/ pincode"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="location-search-input"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Dropdown Popup */}
      {showUserDropdown && (
        <div className="user-dropdown-overlay" onClick={() => setShowUserDropdown(false)}>
          <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="user-dropdown-content">
              <div className="user-auth-section">
                <button 
                  className="signin-btn"
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowUserDropdown(false);
                  }}
                >
                  Sign in
                </button>
                <div className="signup-text">
                  <span className="new-customer">New Customer? </span>
                  <button 
                    className="signup-link"
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowUserDropdown(false);
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* Enhanced Left Drawer Sidebar */}
      {isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <Link to="/" className="brand" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="Organvi" />
              </Link>
              <button className="drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Login Section with Icons */}
              <div className="drawer-login-section">
                <div className="drawer-login-row">
                  <div className="drawer-login-item" onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}>
                    <User size={18} className="login-icon" />
                    <span>Log In</span>
                  </div>
                  <div className="drawer-icons-group">
                    <button className="drawer-icon-btn notification-btn">
                      <Bell size={24} className="notification-icon" />
                      {notificationCount > 0 && <span className="badge small notification-badge">{notificationCount}</span>}
                    </button>
                    <Link to="/addcart" className="drawer-icon-btn cart-btn" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingCart size={24} className="cart-icon" />
                      {cartCount > 0 && <span className="badge small cart-badge">{cartCount}</span>}
                    </Link>
                  </div>
                </div>
              </div>

             
              

              {/* Account Section */}
              <div className="drawer-account-section">
                <div className="drawer-item">
                  <User size={18} />
                  <span>My Account</span>
                </div>
                <div className="drawer-item">
                  <Package size={18} />
                  <span>My Orders</span>
                </div>
                <div className="drawer-item">
                  <Heart size={18} />
                  <span>My Wishlist</span>
                  {wishlistCount > 0 && <span className="badge small">{wishlistCount}</span>}
                </div>
              </div>

              {/* Horizontal Line */}
              <div className="drawer-divider" />

              {/* Better by Choice Section */}
              <div className="drawer-section">Better by Choice</div>

              {/* Horizontal Line */}
              <div className="drawer-divider" />

              {/* Help & Support Section */}
              <div className="drawer-support-section">
                <div className="drawer-item">
                  <MessageCircle size={18} />
                  <span>Help & Support</span>
                </div>
                <div className="drawer-item">
                  <span>About Us</span>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="drawer-social-section">
                <div className="drawer-section">Find Us Here</div>
                <div className="drawer-social-links">
                  <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer" className="drawer-social-link">
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://linkedin.com/company/organvi" target="_blank" rel="noopener noreferrer" className="drawer-social-link">
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://instagram.com/organvi" target="_blank" rel="noopener noreferrer" className="drawer-social-link">
                    <Instagram size={18} />
                    <span>Instagram</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
