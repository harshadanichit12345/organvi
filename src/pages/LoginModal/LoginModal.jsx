import React, { useState } from 'react';
import './LoginModal.css'; // ✅ Correct (relative to same folder)


const LoginModal = ({ onClose }) => {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (phone.length === 10) {
      alert(`Logged in with number: ${phone}`);
      onClose();
    } else {
      alert('Enter a valid 10-digit mobile number');
    }
  };

  const handleGuestLogin = () => {
    alert('Logged in as guest');
    onClose();
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-box">
        <button onClick={onClose} className="login-modal-close">×</button>
        <h2 className="login-modal-title">Login</h2>
        <input
          type="tel"
          className="login-modal-input"
          placeholder="Enter mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={10}
        />
        <button onClick={handleLogin} className="login-modal-btn login-primary-btn">
          Login with Mobile
        </button>
        <button onClick={handleGuestLogin} className="login-modal-btn login-guest-btn">
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginModal;