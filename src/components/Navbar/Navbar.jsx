import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
  Heart,
  Package,
  MessageCircle,
  Instagram,
  Linkedin,
  ExternalLink,
  Grid3X3,
  Wheat,
  Nut,
  Candy,
  ChefHat,
  Gift,
  Droplets,
  Apple,
  Coffee
} from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/organvilogo1.png';
import LoginModal from '../../pages/LoginModal/LoginModal';

// Import category images (same as desktop)
import allProductIcon from '../../assets/allproduct.png';
import pulsesIcon from '../../assets/pulses.png';
import dryFruitsIcon from '../../assets/dryfruits.png';
import sweetenerIcon from '../../assets/sweetner.png';
import spicesIcon from '../../assets/spices.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Handle logo click
  const handleLogoClick = () => {
    setShowLocationDropdown(false);
    setShowUserDropdown(false);
    setShowSearchArea(false);
    setShowLoginModal(false);
    setShowSearchResults(false);
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      // Mock search results - replace with actual search logic
      const mockResults = [
        { id: 1, name: 'Organic Turmeric Powder', category: 'Spices' },
        { id: 2, name: 'Organic Basmati Rice', category: 'Rice' },
        { id: 3, name: 'Organic Almonds', category: 'Dry Fruits' },
        { id: 4, name: 'Organic Jaggery', category: 'Sweeteners' },
        { id: 5, name: 'Organic Moong Dal', category: 'Pulses' }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or handle search
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = cart.length;
      setCartCount(uniqueItems);
    };
    
    const handleCartUpdated = (event) => {
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

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close hamburger menu when switching screen sizes
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized to:', window.innerWidth); // Debug log
      
      // Close menu when switching to desktop view
      if (window.innerWidth >= 1024 && isMenuOpen) {
        console.log('Closing hamburger menu - switched to desktop view'); // Debug log
        setIsMenuOpen(false);
      }
      // Close menu when switching between any screen sizes
      else if (isMenuOpen) {
        console.log('Closing hamburger menu - screen size changed'); // Debug log
        setIsMenuOpen(false);
      }
    };

    // Check on initial load if we're on desktop
    if (window.innerWidth >= 1024) {
      console.log('Initial load - desktop view, closing menu'); // Debug log
      setIsMenuOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navbar - White background, positioned below green bar */}
      <header className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            
            {/* Left Side - Logo */}
            <div className="navbar-left">
              {/* Hamburger Menu - Hidden on desktop */}
              <button 
                className="hamburger-menu"
                onClick={() => {
                  console.log('Hamburger clicked, current state:', isMenuOpen);
                  setIsMenuOpen(!isMenuOpen);
                  console.log('New state will be:', !isMenuOpen);
                }}
                aria-label="Open menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              {/* Logo - No border or outline on click */}
              <Link 
                to="/" 
                className="navbar-logo" 
                onClick={handleLogoClick}
                title="Go to Homepage"
              >
                <img 
                  src={logo} 
                  alt="organic tattva" 
                  className="logo-image"
                />
              </Link>
            </div>

            {/* Center - Search Bar */}
            <div className="navbar-center">
              <div className="search-wrapper">
                {/* Universal Search Bar - Full width in center */}
                <div className="search-container">
                  <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for products"
                      className="search-input"
                    />
                    <button
                      type="submit"
                      className="search-button"
                    >
                      <Search size={20} />
                    </button>
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="search-results-dropdown">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="search-result-item"
                          onClick={() => {
                            navigate(`/product/${result.id}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="result-name">{result.name}</div>
                          <div className="result-category">{result.category}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Selector - Next to search bar */}
                <div 
                  className="location-selector"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                  <MapPin size={18} className="location-icon" />
                  <div className="location-text">
                    <span className="location-label">Deliver to</span>
                    <span className="location-value">Pune 411057</span>
                  </div>
                  <ChevronDown size={16} className="location-chevron" />
                </div>
              </div>
            </div>

            {/* Right Side - Three Circular Icons */}
            <div className="navbar-right">
              {/* User Icon */}
              <Link 
                to="/account" 
                className="navbar-icon user-icon"
                onClick={() => {
                  setShowUserDropdown(false);
                  setShowLocationDropdown(false);
                  setShowSearchArea(false);
                }}
              >
                <User size={24} />
              </Link>

              {/* Heart Icon */}
              <Link 
                to="/like" 
                className="navbar-icon heart-icon"
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="icon-badge">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Badge */}
              <Link 
                to="/cart" 
                className="navbar-icon cart-icon"
              >
                <ShoppingCart size={24} />
                <span className="icon-badge">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowLocationDropdown(false)}
        >
          <div 
            className="location-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-content">
              <button 
                className="search-area-button"
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

      {/* User Dropdown */}
      {showUserDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowUserDropdown(false)}
        >
          <div 
            className="user-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-content">
              <div className="auth-section">
                <button 
                  className="signin-button"
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowUserDropdown(false);
                  }}
                >
                  Sign in
                </button>
                <div className="signup-section">
                  <span className="new-customer-text">New Customer? </span>
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

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div 
          className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <aside 
            className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <span className="menu-title">MENU</span>
              <button 
                className="sidebar-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Body - Only Categories */}
            <div className="sidebar-content">
              {/* Categories Section */}
              <div className="sidebar-section">
                <div className="categories-section">
                  {[
                    { name: 'Pulses & Dal', path: '/pulses', icon: pulsesIcon },
                    { name: 'Sweetener', path: '/sweetener', icon: sweetenerIcon },
                    { name: 'Dry Fruits & Nuts', path: '/dryfruits', icon: dryFruitsIcon },
                    { name: 'Spices & Masalas', path: '/spices', icon: spicesIcon }
                  ].map((category, index) => (
                    <button
                      key={index}
                      className="category-item"
                      onClick={() => {
                        if (category.path !== '#') {
                          navigate(category.path);
                        }
                        setIsMenuOpen(false);
                      }}
                    >
                      <img src={category.icon} alt={category.name} className="category-icon" />
                      <span className="category-name">{category.name}</span>
                    </button>
                  ))}
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