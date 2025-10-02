import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Grid3X3, 
  MapPin, 
  Heart, 
  LogOut, 
  Check,
  ShoppingCart,
  User
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Address from './Address';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const { userData, phoneNumber, countryCode, logoutUser } = useUser();

  const handleLogout = () => {
    // Clear user data and redirect to login
    logoutUser();
    navigate('/account');
  };

  const handleMakeFirstOrder = () => {
    navigate('/allcategories');
  };

  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';
  const email = userData ? userData.email : '';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="header-title">MY ACCOUNT</h1>
      </div>

      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <Grid3X3 size={20} />
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveSection('addresses')}
            >
              <MapPin size={20} />
              <span>Addresses (0)</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveSection('wishlist')}
            >
              <Heart size={20} />
              <span>Wishlist (0)</span>
            </button>
            
            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>

        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-section">
              {/* Welcome Message */}
              <div className="welcome-section">
                <p className="welcome-text">
                  Hello {fullName} (not {fullName}? <button className="logout-link" onClick={handleLogout}>Log out</button>)
                </p>
              </div>

              {/* Order History */}
              <div className="order-history-section">
                <h2 className="section-title">Order History:</h2>
                <div className="first-order-box" onClick={handleMakeFirstOrder}>
                  <Check size={24} className="check-icon" />
                  <div className="first-order-content">
                    <p className="first-order-title">MAKE YOUR FIRST ORDER</p>
                    <p className="first-order-subtitle">You haven't placed any orders yet.</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="account-details-section">
                <h2 className="section-title">Account details:</h2>
                <div className="account-info">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{fullName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">E-mail:</span>
                    <span className="info-value">{email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'addresses' && (
            <div className="addresses-section">
              <Address />
            </div>
          )}

          {activeSection === 'wishlist' && (
            <div className="wishlist-section">
              <h2 className="section-title">Wishlist</h2>
              <div className="empty-wishlist">
                <Heart size={48} className="empty-icon" />
                <p className="empty-text">Your wishlist is empty</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Delivery Icon */}
      <div className="floating-delivery">
        <ShoppingCart size={24} />
      </div>
    </div>
  );
};

export default Dashboard;
