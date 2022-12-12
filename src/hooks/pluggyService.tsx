import { CLIENT_ID, CLIENT_SECRET } from '@env';
import React, { createContext, useContext } from 'react';
import { PluggyClient } from '../services/pluggy';

type PluggyServiceContextProps = {
  pluggyClient: PluggyClient;
};

const defaultValues: PluggyServiceContextProps = {
  pluggyClient: new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  }),
};

const PluggyServiceContext = createContext(defaultValues);

const PluggyServiceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PluggyServiceContext.Provider value={defaultValues}>{children}</PluggyServiceContext.Provider>
  );
};

const usePluggyService = () => {
  const { pluggyClient } = useContext(PluggyServiceContext);

  return pluggyClient;
};

export { PluggyServiceContextProvider };
export default usePluggyService;
