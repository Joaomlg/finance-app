import React from 'react';
import { PluggyServiceContextProvider } from './pluggyService';

const HooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PluggyServiceContextProvider>{children}</PluggyServiceContextProvider>;
};

export default HooksProvider;
