import React, { createContext, useContext } from 'react';
import { BelvoClient, BelvoService } from '../services/belvo';
import { BELVO_CLIENT_ID, BELVO_CLIENT_SECRET } from 'react-native-dotenv';

type BelvoContextProps = {
  belvoService: BelvoService;
};

const defaultValues: BelvoContextProps = {
  belvoService: new BelvoService(
    new BelvoClient(BELVO_CLIENT_ID, BELVO_CLIENT_SECRET, __DEV__ ? 'sandbox' : 'development'),
  ),
};

const BelvoContext = createContext(defaultValues);

const BelvoContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BelvoContext.Provider value={defaultValues}>{children}</BelvoContext.Provider>;
};

const useBelvo = () => {
  const { belvoService } = useContext(BelvoContext);
  return belvoService;
};

export { BelvoContextProvider };

export default useBelvo;
