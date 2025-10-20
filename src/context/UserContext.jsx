import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      const storedPhone = localStorage.getItem('userPhone');
      const storedCode = localStorage.getItem('userCountryCode');
      if (storedUser) setUserData(JSON.parse(storedUser));
      if (storedPhone) setPhoneNumber(storedPhone);
      if (storedCode) setCountryCode(storedCode);
    } catch (_) {}
  }, []);

  const loginUser = (user, phone, country) => {
    setUserData(user);
    setPhoneNumber(phone);
    setCountryCode(country);
    try {
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('userPhone', phone || '');
      localStorage.setItem('userCountryCode', country || '+91');
    } catch (_) {}
  };

  const logoutUser = () => {
    setUserData(null);
    setPhoneNumber('');
    setCountryCode('+91');
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userCountryCode');
    } catch (_) {}
  };

  return (
    <UserContext.Provider value={{
      userData,
      phoneNumber,
      countryCode,
      loginUser,
      logoutUser
    }}>
      {children}
    </UserContext.Provider>
  );
};
