import React from 'react';
import { AuthContextProvider } from '../contexts/AuthContext';

const HooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default HooksProvider;
