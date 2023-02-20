import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import usePluggyService from '../hooks/pluggyService';
import { Account, Investment, Item, Transaction } from '../services/pluggy';
import { range } from '../utils/array';
import {
  ItemsAsyncStorageKey,
  LastUpdateDateFormat,
  LastUpdateDateStorageKey,
} from '../utils/contants';
import { sleep } from '../utils/time';

const NUBANK_IGNORED_TRANSACTIONS = ['Dinheiro guardado', 'Dinheiro resgatado'];

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
  items: Item[];
  storeItem: (item: Item) => Promise<void>;
  deleteItem: (item: Item) => Promise<void>;
  fetchItems: () => Promise<void>;
  fetchingItems: boolean;
  updateItems: () => Promise<boolean>;
  updatingItems: boolean;
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
const currentMonth = now.startOf('month');

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideValues, setHideValues] = useState(false);
  const [date, setDate] = useState(now);
  const [lastUpdateDate, setLastUpdateDate] = useState('');

  const [itemsId, setItemsId] = useState([] as string[]);
  const [loadingItemsId, setLoadingItemsId] = useState(false);

  const [items, setItems] = useState([] as Item[]);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(false);

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

  const isLoading =
    loadingItemsId ||
    fetchingItems ||
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
    const firstItemCreatedAt = items.reduce((minDate, item) => {
      const createdAt = moment(new Date(item.createdAt));
      return createdAt.isBefore(minDate) ? createdAt : minDate;
    }, now.clone());

    return firstItemCreatedAt.subtract(1, 'year');
  }, [items]);

  const storeItem = useCallback(
    async (item: Item) => {
      try {
        const newUniqueItems = [...new Set([...itemsId, item.id])];

        await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newUniqueItems));

        setItemsId(newUniqueItems);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Não foi possível armazenar a nova conexão!' });
      }
    },
    [itemsId],
  );

  const deleteItem = useCallback(
    async (item: Item) => {
      try {
        await pluggyService.deleteItem(item.id);

        const newItemsId = itemsId.filter((itemId) => itemId !== item.id);

        await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newItemsId));

        setItemsId(newItemsId);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Não foi possível apagar a conexão!' });
      }
    },
    [pluggyService, itemsId],
  );

  const fetchItems = useCallback(async () => {
    if (itemsId.length === 0) {
      return;
    }

    setFetchingItems(true);

    try {
      const itemList = await Promise.all(itemsId.map((id) => pluggyService.fetchItem(id)));
      setItems(itemList);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informação das conexões!' });
    }

    setFetchingItems(false);
  }, [pluggyService, itemsId]);

  const updateItems = useCallback(async () => {
    setUpdatingItems(true);

    let success = true;

    try {
      const itemList = await Promise.all(
        itemsId.map(async (id) => {
          let item = await pluggyService.updateItem(id);

          while (item.status === 'UPDATING') {
            await sleep(2000);
            item = await pluggyService.fetchItem(id);
          }

          return item;
        }),
      );

      setItems(itemList);

      const updateDate = now.format(LastUpdateDateFormat);
      await AsyncStorage.setItem(LastUpdateDateStorageKey, updateDate);

      setLastUpdateDate(updateDate);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível sincronizar as conexões!' });
      success = false;
    }

    setUpdatingItems(false);

    return success;
  }, [pluggyService, itemsId]);

  const fetchAccounts = useCallback(async () => {
    if (items.length === 0) {
      return;
    }

    setFetchingAccounts(true);

    try {
      const result = await Promise.all(items.map(({ id }) => pluggyService.fetchAccounts(id)));

      const accountList = result.reduce(
        (list, item) => [...list, ...item.results],
        [] as Account[],
      );

      setAccounts(accountList);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das contas!' });
    }

    setFetchingAccounts(false);
  }, [pluggyService, items]);

  const fetchInvestments = useCallback(async () => {
    if (items.length === 0) {
      return;
    }

    setFetchingInvestments(true);

    try {
      const result = await Promise.all(items.map(({ id }) => pluggyService.fetchInvestments(id)));

      const investmentList = result.reduce(
        (list, item) => [...list, ...item.results],
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
  }, [pluggyService, items]);

  const fetchMonthTransactions = useCallback(
    async (monthDate: Moment) => {
      const startDate = moment(monthDate).startOf('month');
      const endDate = moment(monthDate).endOf('month');

      const result = await Promise.all(
        accounts
          .filter((item) => item.type !== 'CREDIT')
          .map(({ id }) =>
            pluggyService.fetchTransactions(id, {
              pageSize: 500,
              from: startDate.format('YYYY-MM-DD'),
              to: endDate.format('YYYY-MM-DD'),
            }),
          ),
      );

      const transactionsList = result
        .reduce((list, item) => [...list, ...item.results], [] as Transaction[])
        .filter((item) => !NUBANK_IGNORED_TRANSACTIONS.includes(item.description))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return transactionsList;
    },
    [pluggyService, accounts],
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

      const results = await Promise.all(dates.map((item) => fetchMonthTransactions(item)));

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
    const loadItemsId = async () => {
      setLoadingItemsId(true);

      const serializedIds = await AsyncStorage.getItem(ItemsAsyncStorageKey);
      const ids: string[] = serializedIds ? JSON.parse(serializedIds) : [];

      setItemsId(ids);

      setLoadingItemsId(false);
    };

    loadItemsId();
  }, []);

  useEffect(() => {
    const fetchOrUpdateItems = async () => {
      const updateDate = await AsyncStorage.getItem(LastUpdateDateStorageKey);

      const shouldUpdate = updateDate
        ? now.isAfter(moment(updateDate, LastUpdateDateFormat), 'day')
        : true;

      let updatedSuccess = true;

      if (shouldUpdate) {
        updatedSuccess = await updateItems();
      }

      const shouldFetchItems = !shouldUpdate || !updatedSuccess;

      if (shouldFetchItems) {
        setLastUpdateDate(updateDate as string);
        await fetchItems();
      }
    };

    fetchOrUpdateItems();
  }, [itemsId, fetchItems, updateItems]);

  useEffect(() => {
    fetchAccounts();
    fetchInvestments();
  }, [items, fetchAccounts, fetchInvestments]);

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
        items,
        storeItem,
        deleteItem,
        fetchItems,
        fetchingItems,
        updateItems,
        updatingItems,
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
      {updatingItems && <LoadingModal text="Sincronizando conexões" />}
    </AppContext.Provider>
  );
};

export default AppContext;
