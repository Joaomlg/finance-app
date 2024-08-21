import React, { createContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Wallet } from '../models';
import * as walletRepository from '../repositories/walletRepository';

export type AppContextValue2 = {
  wallets: Wallet[];
  fetchWallets: () => Promise<void>;
  fetchingWallets: boolean;
  createWallet: (wallet: Wallet) => Promise<void>;
  updateWallet: (id: string, values: Partial<Wallet>) => Promise<void>;
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

  const createWallet = async (wallet: Wallet) => {
    setFetchingWallets(true);

    try {
      await walletRepository.setWallet(wallet);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a carteira!' });
    }

    setFetchingWallets(false);
  };

  const updateWallet = async (id: string, values: Partial<Wallet>) => {
    setFetchingWallets(true);

    try {
      await walletRepository.updateWallet(id, values);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da carteira!',
      });
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
        fetchWallets,
        fetchingWallets,
        createWallet,
        updateWallet,
        deleteWallet,
      }}
    >
      {children}
    </AppContext2.Provider>
  );
};

export default AppContext2;
