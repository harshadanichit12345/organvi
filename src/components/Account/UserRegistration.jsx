import React, { useState } from 'react';
import { ArrowRight, User, Mail } from 'lucide-react';
import './UserRegistration.css';

const UserRegistration = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim() && email.trim()) {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim()
      };
      onComplete(userData);
    }
  };

  return (
    <div className="user-registration-container">
      <div className="user-registration-form">
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Complete Your Profile</h1>
          <p className="registration-subtitle">Please provide your details to continue</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* First Name */}
          <div className="input-group">
            <label className="input-label">First Name</label>
            <div className="input-container">
              <User size={20} className="input-icon" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="input-group">
            <label className="input-label">Last Name</label>
            <div className="input-container">
              <User size={20} className="input-icon" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email ID</label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="complete-profile-btn">
            <span>Complete Profile</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
