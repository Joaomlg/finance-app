import { CLIENT_ID, CLIENT_SECRET } from 'react-native-dotenv';
import React, { createContext, useContext } from 'react';
import { Client } from '../services/belvo';

type BelvoContextProps = {
  client: Client;
};

const defaultValues: BelvoContextProps = {
  client: new Client(CLIENT_ID, CLIENT_SECRET, __DEV__ ? 'sandbox' : 'development'),
};

const BelvoContext = createContext(defaultValues);

const BelvoContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BelvoContext.Provider value={defaultValues}>{children}</BelvoContext.Provider>;
};

const useBelvo = () => {
  const { client } = useContext(BelvoContext);
  return client;
};

export { BelvoContextProvider };

export default useBelvo;
