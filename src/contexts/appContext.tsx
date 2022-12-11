import { CLIENT_ID, CLIENT_SECRET } from '@env';
import React, { createContext } from 'react';
import { PluggyClient } from '../services/pluggy';

type AppContextProps = {
  pluggyClient: PluggyClient
}

const defaultValues: AppContextProps = {
  pluggyClient: new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  })
};

const AppContext = createContext(defaultValues);

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider value={defaultValues}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContextProvider };
export default AppContext;