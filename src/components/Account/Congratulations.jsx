import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './Congratulations.css';

const Congratulations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="congratulations-container">
      <div className="congratulations-form">
        {/* Congratulations Emoji */}
        <div className="congratulations-emoji">
          🎉
        </div>

        {/* Congratulations Message */}
        <div className="congratulations-message">
          <h1 className="congratulations-title">Congratulations</h1>
          <p className="congratulations-subtitle">Verified Successfully</p>
        </div>

        {/* Loading Spinner */}
        <div className="loading-section">
          <Loader2 className="spinner" size={32} />
          <p className="loading-text">Redirecting...</p>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;
