import React, { createContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Wallet } from '../models';
import * as walletRepository from '../repositories/walletRepository';

export type AppContextValue2 = {
  wallets: Wallet[];
  fetchWallets: () => Promise<void>;
  fetchingWallets: boolean;
  setWallet: (wallet: Wallet) => Promise<void>;
  deleteWallet: (wallet: Wallet) => Promise<void>;
};

const AppContext2 = createContext({} as AppContextValue2);

export const AppContextProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [fetchingWallets, setFetchingWallets] = useState(false);

  const fetchWallets = async () => {
    setFetchingWallets(true);

    try {
      const wallets = await walletRepository.getWallets();
      setWallets(wallets);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das carteiras!' });
    }

    setFetchingWallets(false);
  };

  const setWallet = async (wallet: Wallet) => {
    setFetchingWallets(true);

    try {
      await walletRepository.setWallet(wallet);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível efetuar a operação!' });
    }

    setFetchingWallets(false);
  };

  const deleteWallet = async (wallet: Wallet) => {
    setFetchingWallets(true);

    try {
      walletRepository.deleteWallet(wallet);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Não foi possível apagar a carteira.',
      });
    }

    setFetchingWallets(false);
  };

  useEffect(() => {
    return walletRepository.onWalletsChange((wallets) => setWallets(wallets));
  }, []);

  return (
    <AppContext2.Provider
      value={{
        wallets,
        fetchWallets: fetchWallets,
        fetchingWallets: fetchingWallets,
        setWallet: setWallet,
        deleteWallet: deleteWallet,
      }}
    >
      {children}
    </AppContext2.Provider>
  );
};

export default AppContext2;
