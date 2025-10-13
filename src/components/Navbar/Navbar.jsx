import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
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


const Navbar = () => {
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


  return (
    <>
      {/* Main Navbar - White background, positioned below green bar */}
      <header className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            
            {/* Left Side - Logo */}
            <div className="navbar-left">
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
              <div className="search-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for products..."
                    className="search-input"
                  />
                  <button
                    type="submit"
                    className="search-button"
                  >
                    <Search size={18} />
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

    </>
  );
};

export default Navbar;