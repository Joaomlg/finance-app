import React, { createContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { NewAccount } from '../models';
import * as accountRepository from '../repositories/accountRepository';

export type AppContextValue2 = {
  accounts: NewAccount[];
  fetchAccounts: () => Promise<void>;
  fetchingAccounts: boolean;
  setAccount: (account: NewAccount) => Promise<void>;
  deleteAccount: (account: NewAccount) => Promise<void>;
};

const AppContext2 = createContext({} as AppContextValue2);

export const AppContextProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState([] as NewAccount[]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  const fetchAccounts = async () => {
    setFetchingAccounts(true);

    try {
      const accounts = await accountRepository.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das contas!' });
    }

    setFetchingAccounts(false);
  };

  const setAccount = async (account: NewAccount) => {
    setFetchingAccounts(true);

    try {
      await accountRepository.setAccount(account);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível efetuar a operação!' });
    }

    setFetchingAccounts(false);
  };

  const deleteAccount = async (account: NewAccount) => {
    setFetchingAccounts(true);

    try {
      accountRepository.deleteAccount(account);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Não foi possível apagar a conta.',
      });
    }

    setFetchingAccounts(false);
  };

  useEffect(() => {
    return accountRepository.onAccountsChange((accounts) => setAccounts(accounts));
  }, []);

  return (
    <AppContext2.Provider
      value={{ accounts, fetchAccounts, fetchingAccounts, setAccount, deleteAccount }}
    >
      {children}
    </AppContext2.Provider>
  );
};

export default AppContext2;
