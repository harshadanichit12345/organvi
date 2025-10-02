import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import OTPVerification from './OTPVerification';
import UserRegistration from './UserRegistration';
import Congratulations from './Congratulations';
import './Account.css';

const Account = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleRequestOTP = (e) => {
    e.preventDefault();
    // Handle OTP request logic here
    console.log('Requesting OTP for phone:', countryCode + phoneNumber);
    setShowOTPScreen(true);
  };

  const handleVerifyOTP = (otp) => {
    console.log('Verifying OTP:', otp);
    // Handle OTP verification logic here
    // Show user registration form after successful verification
    setShowUserRegistration(true);
  };

  const handleUserRegistrationComplete = (data) => {
    console.log('User registration completed:', data);
    setUserData(data);
    // Login user with context
    loginUser(data, phoneNumber, countryCode);
    setShowUserRegistration(false);
    setShowCongratulations(true);
  };

  const handleResendOTP = () => {
    console.log('Resending OTP to:', countryCode + phoneNumber);
    // Handle resend OTP logic here
  };

  const handleEditNumber = () => {
    setShowOTPScreen(false);
  };

  const handleBack = () => {
    setShowOTPScreen(false);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };


  if (showCongratulations) {
    return <Congratulations />;
  }

  if (showUserRegistration) {
    return (
      <UserRegistration
        onComplete={handleUserRegistrationComplete}
      />
    );
  }

  if (showOTPScreen) {
    return (
      <OTPVerification
        phoneNumber={phoneNumber}
        countryCode={countryCode}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        onEditNumber={handleEditNumber}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="account-container">
      <div className="account-form">
        {/* Header */}
        <div className="account-header">
          <h1 className="account-title">Login with OTP</h1>
          <p className="account-subtitle">Enter your log in details</p>
        </div>

        {/* Phone Input */}
        <form onSubmit={handleRequestOTP} className="phone-form">
          <div className="phone-input-container">
            {/* Country Code Selector */}
            <div className="country-selector">
              <div 
                className="country-flag"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <img 
                  src="https://flagcdn.com/w20/in.png" 
                  alt="India Flag" 
                  className="flag-image"
                />
                <span className="country-code">{countryCode}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              {showCountryDropdown && (
                <div className="country-dropdown">
                  <div 
                    className="country-option"
                    onClick={() => {
                      setCountryCode('+91');
                      setShowCountryDropdown(false);
                    }}
                  >
                    <img src="https://flagcdn.com/w20/in.png" alt="India" />
                    <span>+91</span>
                  </div>
                  <div 
                    className="country-option"
                    onClick={() => {
                      setCountryCode('+1');
                      setShowCountryDropdown(false);
                    }}
                  >
                    <img src="https://flagcdn.com/w20/us.png" alt="USA" />
                    <span>+1</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Phone Input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter Phone Number"
              className="phone-input"
              maxLength="10"
              required
            />
          </div>

          {/* Request OTP Button */}
          <button type="submit" className="request-otp-btn">
            <span>Request OTP</span>
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <p className="terms-text">
            I accept that I have read & understood{' '}
            <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/terms" className="terms-link">T&Cs</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
