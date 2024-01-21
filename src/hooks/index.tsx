import React from 'react';
import { PluggyServiceContextProvider } from './usePluggyService';
import { BelvoServiceContextProvider } from './useBelvoService';

const HooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PluggyServiceContextProvider>
      <BelvoServiceContextProvider>{children}</BelvoServiceContextProvider>
    </PluggyServiceContextProvider>
  );
};

export default HooksProvider;
