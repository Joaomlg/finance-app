import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import usePluggyService from '../hooks/usePluggyService';
import { Account, Connection, Investment, Transaction } from '../models';
import Provider from '../models/provider';
import { range } from '../utils/array';
import {
  ConnectionsAsyncStorageKey,
  ItemsAsyncStorageKey,
  LastUpdateDateFormat,
  LastUpdateDateStorageKey,
} from '../utils/contants';
import { cloneObject } from '../utils/object';
import { sleep } from '../utils/time';
import useBelvoService from '../hooks/useBelvoService';

const NUBANK_IGNORED_TRANSACTIONS = ['Dinheiro guardado', 'Dinheiro resgatado'];

export type ConnectionContext = {
  id: string;
  connectionId?: string;
  provider: Provider;
};

export type MonthlyBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

export type AppContextValue = {
  isLoading: boolean;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;
  date: Moment;
  setDate: (value: Moment) => void;
  minimumDateWithData: Moment;
  lastUpdateDate: string;
  connections: Connection[];
  storeConnection: (id: string, provider: Provider, forceUpdate?: boolean) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
  fetchConnections: () => Promise<void>;
  fetchingConnections: boolean;
  updateConnections: () => Promise<boolean>;
  updatingConnections: boolean;
  accounts: Account[];
  fetchAccounts: () => Promise<void>;
  fetchingAccounts: boolean;
  investments: Investment[];
  fetchInvestments: () => Promise<void>;
  fetchingInvestments: boolean;
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchingTransactions: boolean;
  monthlyBalances: MonthlyBalance[];
  fetchMonthlyBalancesPage: (itemsPerPage: number, currentPage: number) => Promise<void>;
  fetchingMonthlyBalances: boolean;
  currentMonthlyBalancesPage: number;
  setCurrentMonthlyBalancesPage: (value: number) => void;
  totalBalance: number;
  totalInvoice: number;
  totalInvestment: number;
  incomeTransactions: Transaction[];
  totalIncomes: number;
  expenseTransactions: Transaction[];
  totalExpenses: number;
};

const AppContext = createContext({} as AppContextValue);

const now = moment();
const currentMonth = moment(now).startOf('month');

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideValues, setHideValues] = useState(false);
  const [date, setDate] = useState(now);
  const [lastUpdateDate, setLastUpdateDate] = useState('');

  const [connectionsContext, setConnectionsContext] = useState([] as ConnectionContext[]);
  const [loadingConnectionsId, setLoadingConnectionsId] = useState(false);

  const [connections, setConnections] = useState([] as Connection[]);
  const [fetchingConnections, setFetchingConnections] = useState(false);
  const [updatingConnections, setUpdatingConnections] = useState(false);

  const [accounts, setAccounts] = useState([] as Account[]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  const [investments, setInvestments] = useState([] as Investment[]);
  const [fetchingInvestments, setFetchingInvestments] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const [monthlyBalances, setMonthlyBalances] = useState([] as MonthlyBalance[]);
  const [fetchingMonthlyBalances, setFetchingMonthlyBalances] = useState(false);
  const [currentMonthlyBalancesPage, setCurrentMonthlyBalancesPage] = useState(0);

  const pluggyService = usePluggyService();
  const belvoService = useBelvoService();

  const isLoading =
    loadingConnectionsId ||
    fetchingConnections ||
    fetchingAccounts ||
    fetchingInvestments ||
    fetchingTransactions ||
    fetchingMonthlyBalances;

  const totalBalance = useMemo(
    () =>
      accounts
        .filter(({ type }) => type === 'BANK')
        .reduce((total, { balance }) => total + balance, 0),
    [accounts],
  );

  const totalInvoice = useMemo(
    () =>
      accounts
        .filter(({ type }) => type === 'CREDIT')
        .reduce((total, { balance }) => total + balance, 0),
    [accounts],
  );

  const totalInvestment = useMemo(
    () => investments.reduce((total, { balance }) => total + balance, 0),
    [investments],
  );

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

  const minimumDateWithData = useMemo(() => {
    const firstConnectionCreatedAt = connections.reduce((minDate, connection) => {
      const createdAt = moment(new Date(connection.createdAt));
      return createdAt.isBefore(minDate) ? createdAt : minDate;
    }, now.clone());

    return firstConnectionCreatedAt.subtract(1, 'year');
  }, [connections]);

  const getProviderService = useCallback(
    (provider: Provider) => {
      switch (provider) {
        case 'PLUGGY':
          return pluggyService;
        case 'BELVO':
          return belvoService;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    },
    [belvoService, pluggyService],
  );

  const storeConnection = useCallback(
    async (id: string, provider: Provider, forceUpdate = false) => {
      try {
        const alreadyExists = connectionsContext.find(
          (item) => item.id === id && item.provider === provider,
        );

        if (alreadyExists !== undefined) {
          if (forceUpdate) {
            const newConnectionsContext = cloneObject(connectionsContext);
            setConnectionsContext(newConnectionsContext);
          }
          return;
        }

        const newConnectionsContext: ConnectionContext[] = [
          ...connectionsContext,
          { id, provider },
        ];

        await AsyncStorage.setItem(
          ConnectionsAsyncStorageKey,
          JSON.stringify(newConnectionsContext),
        );

        setConnectionsContext(newConnectionsContext);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Não foi possível armazenar a nova conexão!' });
      }
    },
    [connectionsContext],
  );

  const deleteConnection = useCallback(
    async (id: string) => {
      try {
        const connectionContext = connectionsContext.find((item) => item.id === id);

        if (connectionContext === undefined) {
          throw new Error('Connection not found!');
        }

        const providerService = getProviderService(connectionContext.provider);

        await providerService.deleteConnectionById(id);

        const newConnectionsContext = connectionsContext.filter((item) => item.id !== id);

        await AsyncStorage.setItem(
          ConnectionsAsyncStorageKey,
          JSON.stringify(newConnectionsContext),
        );

        setConnectionsContext(newConnectionsContext);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Não foi possível apagar a conexão!' });
      }
    },
    [connectionsContext, getProviderService],
  );

  const fetchConnections = useCallback(async () => {
    if (connectionsContext.length === 0) {
      return;
    }

    setFetchingConnections(true);

    try {
      const connectionList = await Promise.all(
        connectionsContext.map(({ id, provider }) => {
          const providerService = getProviderService(provider);
          return providerService.fetchConnectionById(id);
        }),
      );
      setConnections(connectionList);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informação das conexões!' });
    }

    setFetchingConnections(false);
  }, [connectionsContext, getProviderService]);

  const updateConnections = useCallback(async () => {
    if (connectionsContext.length === 0) {
      return true;
    }

    setUpdatingConnections(true);

    const commonLastUpdateDate = moment(lastUpdateDate, LastUpdateDateFormat).toISOString();

    let success = true;

    try {
      const connectionList = await Promise.all(
        connectionsContext.map(async ({ id, provider }) => {
          const providerService = getProviderService(provider);

          let connection = await providerService.updateConnectionById(id, commonLastUpdateDate);

          while (connection.status === 'UPDATING') {
            await sleep(2000);
            connection = await providerService.fetchConnectionById(id);
          }

          return connection;
        }),
      );

      setConnections(connectionList);

      const updateDate = now.format(LastUpdateDateFormat);
      await AsyncStorage.setItem(LastUpdateDateStorageKey, updateDate);

      setLastUpdateDate(updateDate);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível sincronizar as conexões!' });
      success = false;
    }

    setUpdatingConnections(false);

    return success;
  }, [connectionsContext, getProviderService, lastUpdateDate]);

  const fetchAccounts = useCallback(async () => {
    if (connections.length === 0) {
      return;
    }

    setFetchingAccounts(true);

    try {
      const result = await Promise.all(
        connections.map((connection) => {
          const providerService = getProviderService(connection.provider);
          return providerService.fetchAccounts(connection);
        }),
      );

      const accountList = result.reduce((list, account) => [...list, ...account], [] as Account[]);

      setAccounts(accountList);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das contas!' });
    }

    setFetchingAccounts(false);
  }, [connections, getProviderService]);

  const fetchInvestments = useCallback(async () => {
    if (connections.length === 0) {
      return;
    }

    setFetchingInvestments(true);

    try {
      const result = await Promise.all(
        connections.map((connection) => {
          const providerService = getProviderService(connection.provider);
          return providerService.fetchInvestments(connection);
        }),
      );

      const investmentList = result.reduce(
        (list, investment) => [...list, ...investment],
        [] as Investment[],
      );

      setInvestments(investmentList);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível obter informações sobre investimentos!',
      });
    }

    setFetchingInvestments(false);
  }, [connections, getProviderService]);

  const fetchMonthTransactions = useCallback(
    async (monthDate: Moment) => {
      const startDate = moment(monthDate).startOf('month');
      const endDate = moment(monthDate).endOf('month');

      const result = await Promise.all(
        accounts
          .filter(({ type }) => type !== 'CREDIT')
          .map((account) => {
            const providerService = getProviderService(account.provider);
            return providerService.fetchTransactions(account, {
              from: startDate.format('YYYY-MM-DD'),
              to: endDate.format('YYYY-MM-DD'),
            });
          }),
      );

      const transactionsList = result
        .reduce((list, transaction) => [...list, ...transaction], [] as Transaction[])
        .filter(({ description }) => !NUBANK_IGNORED_TRANSACTIONS.includes(description))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return transactionsList;
    },
    [accounts, getProviderService],
  );

  const fetchTransactions = useCallback(async () => {
    if (accounts.length === 0) {
      return;
    }

    setFetchingTransactions(true);

    try {
      const transactionsList = await fetchMonthTransactions(date);
      setTransactions(transactionsList);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter as transações!' });
    }

    setFetchingTransactions(false);
  }, [fetchMonthTransactions, date, accounts]);

  const fetchMonthlyBalancesPage = useCallback(
    async (itemsPerPage: number, currentPage: number) => {
      if (accounts.length === 0) {
        return;
      }

      setFetchingMonthlyBalances(true);

      const dates = range(itemsPerPage)
        .map((i) => currentMonth.clone().subtract(i + currentPage * itemsPerPage, 'months'))
        .filter((date) => date.isSameOrAfter(minimumDateWithData, 'month'));

      const results = await Promise.all(dates.map((date) => fetchMonthTransactions(date)));

      const newBalances: MonthlyBalance[] = results.map((transactions, index) => {
        const incomes = transactions
          .filter((transaction) => transaction.type === 'CREDIT')
          .reduce((total, transaction) => total + transaction.amount, 0);

        const expenses = transactions
          .filter((transaction) => transaction.type === 'DEBIT')
          .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

        return { date: dates[index], incomes, expenses };
      });

      setMonthlyBalances((current) =>
        currentPage === 0 ? newBalances : [...current, ...newBalances],
      );

      setFetchingMonthlyBalances(false);
    },
    [accounts, fetchMonthTransactions, minimumDateWithData],
  );

  useEffect(() => {
    const loadConnectionsContext = async () => {
      setLoadingConnectionsId(true);

      const serializedConnectionsContext = await AsyncStorage.getItem(ConnectionsAsyncStorageKey);
      let connectionsContext: ConnectionContext[] = serializedConnectionsContext
        ? JSON.parse(serializedConnectionsContext)
        : [];

      // This is necessary to be compatible with previous versions
      const serializedIds = await AsyncStorage.getItem(ItemsAsyncStorageKey);
      if (serializedIds) {
        const ids: string[] = JSON.parse(serializedIds);

        connectionsContext = [
          ...connectionsContext,
          ...ids.map(
            (id) =>
              ({
                id,
                provider: 'PLUGGY',
              } as ConnectionContext),
          ),
        ] as ConnectionContext[];

        await AsyncStorage.setItem(ConnectionsAsyncStorageKey, JSON.stringify(connectionsContext));
        await AsyncStorage.removeItem(ItemsAsyncStorageKey);
      }

      setConnectionsContext(connectionsContext);

      setLoadingConnectionsId(false);
    };

    loadConnectionsContext();
  }, []);

  useEffect(() => {
    const fetchOrUpdateConnections = async () => {
      const updateDate = await AsyncStorage.getItem(LastUpdateDateStorageKey);

      const shouldUpdate = updateDate
        ? now.isAfter(moment(updateDate, LastUpdateDateFormat), 'day')
        : true;

      let updatedSuccess = true;

      if (shouldUpdate) {
        updatedSuccess = await updateConnections();
      }

      const shouldFetchConnections = !shouldUpdate || !updatedSuccess;

      if (shouldFetchConnections) {
        setLastUpdateDate(updateDate as string);
        await fetchConnections();
      }
    };

    fetchOrUpdateConnections();
  }, [connectionsContext, fetchConnections, updateConnections]);

  useEffect(() => {
    fetchAccounts();
    fetchInvestments();
  }, [connections, fetchAccounts, fetchInvestments]);

  useEffect(() => {
    fetchTransactions();
  }, [accounts, fetchTransactions]);

  useEffect(() => {
    setMonthlyBalances([]);
    setCurrentMonthlyBalancesPage(0);
  }, [accounts]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        hideValues,
        setHideValues,
        date,
        setDate,
        minimumDateWithData,
        lastUpdateDate,
        connections,
        storeConnection,
        deleteConnection,
        fetchConnections,
        fetchingConnections,
        updateConnections,
        updatingConnections,
        accounts,
        fetchAccounts,
        fetchingAccounts,
        investments,
        fetchInvestments,
        fetchingInvestments,
        transactions,
        fetchTransactions,
        fetchingTransactions,
        monthlyBalances,
        fetchMonthlyBalancesPage,
        fetchingMonthlyBalances,
        currentMonthlyBalancesPage,
        setCurrentMonthlyBalancesPage,
        totalBalance,
        totalInvoice,
        totalInvestment,
        incomeTransactions,
        totalIncomes,
        expenseTransactions,
        totalExpenses,
      }}
    >
      {children}
      {updatingConnections && <LoadingModal text="Sincronizando conexões" />}
    </AppContext.Provider>
  );
};

export default AppContext;
