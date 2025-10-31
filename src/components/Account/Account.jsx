import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
// import OTPVerification from './OTPVerification';
import UserRegistration from './UserRegistration';
// import Congratulations from './Congratulations';
import './Account.css';

const Account = () => {
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [countryCode, setCountryCode] = useState('+91');
  // const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  // const [showOTPScreen, setShowOTPScreen] = useState(false);
  // const [showUserRegistration, setShowUserRegistration] = useState(false);
  // const [showCongratulations, setShowCongratulations] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useUser();

  // If already logged in, redirect away from login page
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        navigate('/dashboard');
      }
    } catch (_) {}
  }, [navigate]);

  // const handleRequestOTP = (e) => {
  //   e.preventDefault();
  //   console.log('Requesting OTP for phone:', countryCode + phoneNumber);
  //   setShowOTPScreen(true);
  // };

  // const handleVerifyOTP = (otp) => {
  //   console.log('Verifying OTP:', otp);
  //   setShowUserRegistration(true);
  // };

  const handleUserRegistrationComplete = (data) => {
    console.log('User registration completed:', data);
    setUserData(data);
    // Directly log in and go to dashboard (skip congratulations)
    loginUser(data);
    navigate('/dashboard');
  };

  // const handleResendOTP = () => {
  //   console.log('Resending OTP to:', countryCode + phoneNumber);
  // };

  // const handleEditNumber = () => {
  //   setShowOTPScreen(false);
  // };

  // const handleBack = () => {
  //   setShowOTPScreen(false);
  // };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleCloseModal = () => {
    navigate(-1); // Go back to previous page
  };


  // Directly show user registration page when visiting /account
  return (
    <UserRegistration
      onComplete={handleUserRegistrationComplete}
    />
  );
  // The below original OTP flow UI is intentionally commented out to disable it
};

export default Account;
