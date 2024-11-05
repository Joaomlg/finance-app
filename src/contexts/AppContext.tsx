import { Moment } from 'moment';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import { Transaction, Wallet } from '../models';
import Provider from '../models/provider';
import { transactionRepository, walletRepository } from '../repositories';
import { getProviderService } from '../services/providerServiceFactory';
import { range } from '../utils/array';
import { NOW, CURRENT_MONTH } from '../utils/date';
import { RecursivePartial } from '../utils/type';
import AuthContext from './AuthContext';

export type MonthlyBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

export type AppContextValue = {
  date: Moment;
  setDate: (value: Moment) => void;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;

  setupConnection: (connectionId: string, provider: Provider) => Promise<void>;
  syncWalletConnection: (wallet: Wallet) => Promise<void>;

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

  totalInvoice: number;

  monthlyBalances: MonthlyBalance[];
  fetchMonthlyBalancesPage: (itemsPerPage: number, currentPage: number) => Promise<void>;
  fetchingMonthlyBalances: boolean;
  currentMonthlyBalancesPage: number;
  setCurrentMonthlyBalancesPage: (value: number) => void;
};

const AppContext = createContext({} as AppContextValue);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticated } = useContext(AuthContext);

  const [date, setDate] = useState(NOW);
  const [hideValues, setHideValues] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();

  const [wallets, setWallets] = useState([] as Wallet[]);
  const [fetchingWallets, setFetchingWallets] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const [monthlyBalances, setMonthlyBalances] = useState([] as MonthlyBalance[]);
  const [fetchingMonthlyBalances, setFetchingMonthlyBalances] = useState(false);
  const [currentMonthlyBalancesPage, setCurrentMonthlyBalancesPage] = useState(0);

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

  const totalInvoice = 0;

  const setLoading = (status: boolean, message?: string) => {
    setIsLoading(status);
    setLoadingMessage(message);
  };

  const setupConnection = async (connectionId: string, provider: Provider) => {
    const providerService = getProviderService(provider);

    setLoading(true, 'Configurando nova conexão');

    await providerService.fetchConnection(
      connectionId,
      walletRepository.setWalletsBatch,
      transactionRepository.setTransactionsBatch,
    );

    setLoading(false);
  };

  const syncWalletConnection = useCallback(async (wallet: Wallet, configureLoading = true) => {
    if (wallet.connection === undefined) {
      return;
    }

    const providerService = getProviderService(wallet.connection.provider);

    configureLoading && setLoading(true, 'Sincronizando conexão');

    try {
      const lastTransaction = await transactionRepository.getLastWalletTransaction(wallet.id);

      await providerService.syncConnection(
        wallet.connection.id,
        lastTransaction?.date || wallet.connection.lastUpdatedAt,
        !wallet.connection.updateDisabled,
        walletRepository.updateWalletsBatch,
        transactionRepository.setTransactionsBatch,
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Erro ao sincronizar conexão "${wallet.name}"!`,
      });
    }

    configureLoading && setLoading(false);
  }, []);

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
      Toast.show({ type: 'success', text1: 'Carteira criada com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a carteira!' });
    }

    setFetchingWallets(false);
  };

  const updateWallet = async (id: string, values: RecursivePartial<Wallet>) => {
    setFetchingWallets(true);

    try {
      await walletRepository.updateWallet(id, values);
      Toast.show({ type: 'success', text1: 'Carteira atualizada com sucesso!' });
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

    let hasError = false;

    try {
      await walletRepository.deleteWallet(wallet);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar a carteira!',
      });
      return;
    }

    try {
      await transactionRepository.deleteAllTransactionsByWalletId(wallet.id);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar as transações da carteira!',
      });
      hasError = true;
    }

    try {
      await deleteWalletConnectionIfNecessary(wallet);
    } catch (error) {
      Toast.show({
        type: 'warn',
        text1: 'Não foi possível apagar a conexão com o provedor!',
      });
      hasError = true;
    }

    if (!hasError) {
      Toast.show({ type: 'success', text1: 'Carteira removida com sucesso!' });
    }

    setFetchingWallets(false);
  };

  const deleteWalletConnectionIfNecessary = async (wallet: Wallet) => {
    if (!wallet.connection) {
      return;
    }

    const hasOtherWalletWithSameConnection = wallets.find(
      (item) => item.connection?.id === wallet.connection?.id && item.id !== wallet.id,
    );

    if (hasOtherWalletWithSameConnection) {
      return;
    }

    const providerService = getProviderService(wallet.connection.provider);

    await providerService.deleteConnection(wallet.connection.id);
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
      Toast.show({ type: 'success', text1: 'Transação criada com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a transação!' });
    }

    setFetchingTransactions(false);
  };

  const updateTransaction = async (id: string, values: RecursivePartial<Transaction>) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.updateTransaction(id, values);
      Toast.show({ type: 'success', text1: 'Transação alterada com sucesso!' });
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
      await transactionRepository.deleteTransaction(transaction);
      Toast.show({ type: 'success', text1: 'Transação removida com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
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
      CURRENT_MONTH.clone().subtract(i + currentPage * itemsPerPage, 'months'),
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
    if (!authenticated) return;
    return walletRepository.onWalletsChange((wallets) => setWallets(wallets));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || !wallets || wallets.length === 0) {
      return;
    }

    const walletsToSync = wallets.filter(
      (wallet) =>
        wallet.connection !== undefined && NOW.isAfter(wallet.connection.lastUpdatedAt, 'day'),
    );

    if (!walletsToSync.length) {
      return;
    }

    const syncAllConnections = async () => {
      setLoading(true, 'Sincronizando conexões');
      await Promise.all(walletsToSync.map((wallet) => syncWalletConnection(wallet, false)));
      setLoading(false);
    };

    syncAllConnections();
  }, [authenticated, syncWalletConnection, wallets]);

  useEffect(() => {
    if (!authenticated) return;

    return transactionRepository.onTransactionsChange(
      (transactions) => setTransactions(transactions),
      transactionQueryOptions,
    );
  }, [authenticated, transactionQueryOptions]);

  useEffect(() => {
    setMonthlyBalances([]);
    setCurrentMonthlyBalancesPage(0);
  }, []);

  return (
    <AppContext.Provider
      value={{
        date,
        setDate,
        hideValues,
        setHideValues,
        setupConnection,
        syncWalletConnection,
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
        totalInvoice,
        monthlyBalances,
        fetchMonthlyBalancesPage,
        fetchingMonthlyBalances,
        currentMonthlyBalancesPage,
        setCurrentMonthlyBalancesPage,
      }}
    >
      {children}
      {isLoading && <LoadingModal text={loadingMessage} />}
    </AppContext.Provider>
  );
};

export default AppContext;
