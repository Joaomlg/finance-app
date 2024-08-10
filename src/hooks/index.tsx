import React from 'react';
import { AuthContextProvider } from '../contexts/AuthContext';
import { BelvoServiceContextProvider } from './useBelvoService';
import { PluggyServiceContextProvider } from './usePluggyService';

const HooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContextProvider>
      <PluggyServiceContextProvider>
        <BelvoServiceContextProvider>{children}</BelvoServiceContextProvider>
      </PluggyServiceContextProvider>
    </AuthContextProvider>
  );
};

export default HooksProvider;
