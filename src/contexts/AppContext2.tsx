import moment, { Moment } from 'moment';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Transaction, Wallet } from '../models';
import * as transactionRepository from '../repositories/transactionRepository';
import * as walletRepository from '../repositories/walletRepository';
import { IProviderService } from '../services/providerService.interface';
import { range } from '../utils/array';
import { RecursivePartial } from '../utils/type';

export type MonthlyBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

export type AppContextValue2 = {
  isLoading: boolean;
  date: Moment;
  setDate: (value: Moment) => void;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;

  setupConnection: (connectionId: string, provider: IProviderService) => Promise<void>;

  wallets: Wallet[];
  fetchWallets: () => Promise<void>;
  fetchingWallets: boolean;
  createWallet: (wallet: Wallet) => Promise<void>;
  updateWallet: (id: string, values: RecursivePartial<Wallet>) => Promise<void>;
  deleteWallet: (wallet: Wallet) => Promise<void>;
  totalBalance: number;

  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchingTransactions: boolean;
  createTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, values: RecursivePartial<Transaction>) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  incomeTransactions: Transaction[];
  totalIncomes: number;
  expenseTransactions: Transaction[];
  totalExpenses: number;

  monthlyBalances: MonthlyBalance[];
  fetchMonthlyBalancesPage: (itemsPerPage: number, currentPage: number) => Promise<void>;
  fetchingMonthlyBalances: boolean;
  currentMonthlyBalancesPage: number;
  setCurrentMonthlyBalancesPage: (value: number) => void;
};

const AppContext2 = createContext({} as AppContextValue2);

const now = moment();
const currentMonth = moment(now).startOf('month');

export const AppContextProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [date, setDate] = useState(now);
  const [hideValues, setHideValues] = useState(false);

  const [wallets, setWallets] = useState([] as Wallet[]);
  const [fetchingWallets, setFetchingWallets] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const [monthlyBalances, setMonthlyBalances] = useState([] as MonthlyBalance[]);
  const [fetchingMonthlyBalances, setFetchingMonthlyBalances] = useState(false);
  const [currentMonthlyBalancesPage, setCurrentMonthlyBalancesPage] = useState(0);

  const isLoading = fetchingWallets || fetchingTransactions || fetchingMonthlyBalances;

  const transactionQueryOptions = useMemo(
    () =>
      ({
        interval: {
          startDate: date.startOf('month').toDate(),
          endDate: date.endOf('month').toDate(),
        },
        order: {
          by: 'date',
          direction: 'desc',
        },
      } as transactionRepository.TransactionQueryOptions),
    [date],
  );

  const totalBalance = useMemo(
    () =>
      wallets
        .filter(({ type }) => type === 'CHECKING_ACCOUNT' || type === 'SAVINGS_ACCOUNT')
        .reduce((total, { balance }) => total + balance, 0),
    [wallets],
  );

  const incomeTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'INCOME'),
    [transactions],
  );

  const totalIncomes = useMemo(
    () =>
      incomeTransactions
        .filter(({ ignore }) => !ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [incomeTransactions],
  );

  const expenseTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'EXPENSE'),
    [transactions],
  );

  const totalExpenses = useMemo(
    () =>
      expenseTransactions
        .filter(({ ignore }) => !ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [expenseTransactions],
  );

  const setupConnection = async (connectionId: string, provider: IProviderService) => {
    await provider.fetchConnection(
      connectionId,
      walletRepository.setWalletsBatch,
      transactionRepository.setTransactionsBatch,
    );
  };

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

  const updateWallet = async (id: string, values: RecursivePartial<Wallet>) => {
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
        text1: 'Não foi possível apagar a carteira!',
      });
    }

    try {
      transactionRepository.deleteAllTransactionsByWalletId(wallet.id);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Não foi possível apagar as transações da carteira!',
      });
    }

    setFetchingWallets(false);
  };

  const fetchTransactions = async () => {
    setFetchingTransactions(true);

    try {
      const transactions = await transactionRepository.getTransactions(transactionQueryOptions);
      setTransactions(transactions);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das transações!' });
    }

    setFetchingTransactions(false);
  };

  const createTransaction = async (transaction: Transaction) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.setTransaction(transaction);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a transação!' });
    }

    setFetchingTransactions(false);
  };

  const updateTransaction = async (id: string, values: RecursivePartial<Transaction>) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.updateTransaction(id, values);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da transação!',
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
        text1: 'Não foi possível apagar a transação.',
      });
    }

    setFetchingTransactions(false);
  };

  const fetchMonthlyBalancesPage = async (itemsPerPage: number, currentPage: number) => {
    if (wallets.length === 0) {
      return;
    }

    setFetchingMonthlyBalances(true);

    const dates = range(itemsPerPage).map((i) =>
      currentMonth.clone().subtract(i + currentPage * itemsPerPage, 'months'),
    );

    const results = await Promise.all(
      dates.map((date) =>
        transactionRepository.getTransactions({
          interval: {
            startDate: date.startOf('month').toDate(),
            endDate: date.endOf('month').toDate(),
          },
          order: {
            by: 'date',
            direction: 'desc',
          },
        }),
      ),
    );

    const newBalances: MonthlyBalance[] = results.map((transactions, index) => {
      const incomes = transactions
        .filter((transaction) => transaction.type === 'INCOME' && !transaction.ignore)
        .reduce((total, transaction) => total + transaction.amount, 0);

      const expenses = transactions
        .filter((transaction) => transaction.type === 'EXPENSE' && !transaction.ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

      return { date: dates[index], incomes, expenses };
    });

    setMonthlyBalances((current) =>
      currentPage === 0 ? newBalances : [...current, ...newBalances],
    );

    setFetchingMonthlyBalances(false);
  };

  useEffect(() => {
    setMonthlyBalances([]);
    setCurrentMonthlyBalancesPage(0);
    return walletRepository.onWalletsChange((wallets) => setWallets(wallets));
  }, []);

  useEffect(() => {
    return transactionRepository.onTransactionsChange(
      (transactions) => setTransactions(transactions),
      transactionQueryOptions,
    );
  }, [transactionQueryOptions]);

  return (
    <AppContext2.Provider
      value={{
        isLoading,
        date,
        setDate,
        hideValues,
        setHideValues,
        setupConnection,
        wallets,
        fetchWallets,
        fetchingWallets,
        createWallet,
        updateWallet,
        deleteWallet,
        totalBalance,
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
        monthlyBalances,
        fetchMonthlyBalancesPage,
        fetchingMonthlyBalances,
        currentMonthlyBalancesPage,
        setCurrentMonthlyBalancesPage,
      }}
    >
      {children}
    </AppContext2.Provider>
  );
};

export default AppContext2;
