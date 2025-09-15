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
  LogIn,
  UserPlus,
  Tag,
  ArrowRight,
  Home,
  Heart,
  Sparkles,
  Baby,
  Wheat,
  Nut,
  Grape,
  Candy,
  ChefHat,
  Shield,
  Utensils,
  Leaf,
  Sun,
  Star
} from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/organic_logo1.png';
import LoginModal from '../../pages/LoginModal/LoginModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(total);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const navItems = [
    {
      label: 'Eat Better',
      icon: '🍽️',
      categories: [
        { name: 'Grains', icon: Wheat },
        { name: 'Nuts', icon: Nut },
        { name: 'Fruits', icon: Grape },
        { name: 'Jaggery', icon: Candy },
        { name: 'Spices', icon: ChefHat }
      ]
    },
    {
      label: 'Live Better',
      icon: '🏡',
      categories: [
        { name: 'Immunity', icon: Shield },
        { name: 'Wellness', icon: Heart },
        { name: 'Essentials', icon: Utensils }
      ]
    },
    {
      label: 'Look Better',
      icon: '💆',
      categories: [
        { name: 'Glow', icon: Sun },
        { name: 'Beauty', icon: Sparkles },
        { name: 'Care', icon: Star }
      ]
    },
    {
      label: 'Raise Better',
      icon: '🌍',
      categories: [
        { name: 'Kids', icon: Baby },
        { name: 'Story', icon: Leaf },
        { name: 'Eco', icon: Leaf }
      ]
    }
  ];

  const categories = [
    { label: 'All Categories' },
    { label: 'Fruits & Vegetables' },
    { label: 'Foodgrains, Oils & Masala' },
    { label: 'Dairy, Bakery, Eggs' },
    { label: 'Snacks & Branded Food' },
    { label: 'Beverages' },
    { label: 'Cleaning & House Hold' },
    { label: 'Personal Care' },
    { label: 'Wellness' },
  ];

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
              <div className="deliver">
                <MapPin size={22} />
                <div className="deliver-text">
                  <span className="label">Deliver to</span>
                  <span className="value">Bengaluru 560001</span>
                </div>
                <ChevronDown size={14} />
              </div>

              <div className="account">
                <User size={22} />
                <div className="account-text">
                  <span className="label">Hello, User</span>
                  <span className="value">Account & Lists</span>
                </div>
                <ChevronDown size={14} />
              </div>

              <button className="btn outline" onClick={() => setShowLoginModal(true)}>
                <LogIn size={16} />
                Login
              </button>
              <button className="btn outline" onClick={() => setShowLoginModal(true)}>
                <UserPlus size={16} />
                Sign up
              </button>

              <Link to="/cart" className="cart">
                <ShoppingCart size={18} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>

              <button className="btn offers">
                <Tag size={16} />
                Offers
              </button>
            </div>
          </div>

          <div className="row-links">
            {navItems.map((item, index) => (
              <div 
                key={item.label} 
                className="link-item"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>{item.label}</span>
                <ChevronDown size={12} />
                
                {activeDropdown === index && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      {item.categories.map((category, catIndex) => {
                        const IconComponent = category.icon;
                        return (
                          <div key={catIndex} className="dropdown-category">
                            <IconComponent size={20} />
                            <span className="category-name">{category.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="categories">
        <div className="container">
          <div className="cat-scroll">
            {categories.map((c, index) => (
              <div key={c.label} className={`cat-item ${index === 0 ? 'active' : ''}`}>
                <div className="cat-icon" />
                <span>{c.label}</span>
              </div>
            ))}
            <button className="cat-next">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* Left Drawer Sidebar */}
      {isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <Link to="/" className="brand">
                <img src={logo} alt="Organvi" />
              </Link>
              <button className="drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <button className="drawer-item" onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}>
                <User size={18} />
                <span>Log In</span>
              </button>
              <Link to="/cart" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart size={18} />
                <span>Shopping Cart</span>
                {cartCount > 0 && <span className="badge small">{cartCount}</span>}
              </Link>
              <div className="drawer-item">
                <MapPin size={18} />
                <span>My Orders Tracking</span>
              </div>
              <div className="drawer-item">
                <User size={18} />
                <span>My Account</span>
              </div>
              <div className="drawer-divider" />
              <div className="drawer-section">Better By Choice</div>
              <div className="drawer-divider" />
              <div className="drawer-section muted">MEDIA</div>
              <div className="drawer-item">
                <span>Blogs & Articles</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
