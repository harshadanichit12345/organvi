import React, { createContext, useContext, useState } from 'react';

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

  const loginUser = (user, phone, country) => {
    setUserData(user);
    setPhoneNumber(phone);
    setCountryCode(country);
  };

  const logoutUser = () => {
    setUserData(null);
    setPhoneNumber('');
    setCountryCode('+91');
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
