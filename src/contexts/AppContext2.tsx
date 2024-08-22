import moment, { Moment } from 'moment';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Transaction, Wallet } from '../models';
import * as transactionRepository from '../repositories/transactionRepository';
import * as walletRepository from '../repositories/walletRepository';

export type AppContextValue2 = {
  date: Moment;
  setDate: (value: Moment) => void;

  wallets: Wallet[];
  fetchWallets: () => Promise<void>;
  fetchingWallets: boolean;
  createWallet: (wallet: Wallet) => Promise<void>;
  updateWallet: (id: string, values: Partial<Wallet>) => Promise<void>;
  deleteWallet: (wallet: Wallet) => Promise<void>;

  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchingTransactions: boolean;
  createTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, values: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  incomeTransactions: Transaction[];
  totalIncomes: number;
  expenseTransactions: Transaction[];
  totalExpenses: number;
};

const AppContext2 = createContext({} as AppContextValue2);

const now = moment();

export const AppContextProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [date, setDate] = useState(now);

  const [wallets, setWallets] = useState([] as Wallet[]);
  const [fetchingWallets, setFetchingWallets] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const incomeTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'CREDIT'),
    [transactions],
  );

  const totalIncomes = useMemo(
    () =>
      incomeTransactions.reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [incomeTransactions],
  );

  const expenseTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'DEBIT'),
    [transactions],
  );

  const totalExpenses = useMemo(
    () =>
      expenseTransactions.reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [expenseTransactions],
  );

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

  const fetchTransactions = async () => {
    setFetchingTransactions(true);

    try {
      const transactions = await transactionRepository.getTransactions();
      setTransactions(transactions);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das carteiras!' });
    }

    setFetchingTransactions(false);
  };

  const createTransaction = async (transaction: Transaction) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.setTransaction(transaction);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a carteira!' });
    }

    setFetchingTransactions(false);
  };

  const updateTransaction = async (id: string, values: Partial<Transaction>) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.updateTransaction(id, values);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da carteira!',
      });
    }

    setFetchingTransactions(false);
  };

  const deleteTransaction = async (transaction: Transaction) => {
    setFetchingTransactions(true);

    try {
      transactionRepository.deleteTransaction(transaction);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Não foi possível apagar a carteira.',
      });
    }

    setFetchingTransactions(false);
  };

  useEffect(() => {
    return walletRepository.onWalletsChange((wallets) => setWallets(wallets));
  }, []);

  // useEffect(() => {
  //   return transactionRepository.onTransactionsChange((transactions) => setTransactions(transactions));
  // }, []);

  return (
    <AppContext2.Provider
      value={{
        date,
        setDate,
        wallets,
        fetchWallets,
        fetchingWallets,
        createWallet,
        updateWallet,
        deleteWallet,
        transactions,
        fetchTransactions,
        fetchingTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        incomeTransactions,
        expenseTransactions,
        totalIncomes,
        totalExpenses,
      }}
    >
      {children}
    </AppContext2.Provider>
  );
};

export default AppContext2;
