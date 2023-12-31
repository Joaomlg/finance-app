import { CLIENT_ID, CLIENT_SECRET } from 'react-native-dotenv';
import React, { createContext, useContext } from 'react';
import { PluggyClient, PluggyService } from '../services/pluggy';

type PluggyServiceContextProps = {
  pluggyService: PluggyService;
};

const defaultValues: PluggyServiceContextProps = {
  pluggyService: new PluggyService(
    new PluggyClient({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ),
};

const PluggyServiceContext = createContext(defaultValues);

const PluggyServiceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PluggyServiceContext.Provider value={defaultValues}>{children}</PluggyServiceContext.Provider>
  );
};

const usePluggyService = () => {
  const { pluggyService } = useContext(PluggyServiceContext);
  return pluggyService;
};

export { PluggyServiceContextProvider };
export default usePluggyService;
