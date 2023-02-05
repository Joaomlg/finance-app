import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import usePluggyService from '../hooks/pluggyService';
import { Account, Investment, Item, Transaction } from '../services/pluggy';
import {
  ItemsAsyncStorageKey,
  LastUpdateDateFormat,
  LastUpdateDateStorageKey,
} from '../utils/contants';
import { sleep } from '../utils/time';

const NUBANK_IGNORED_TRANSACTIONS = [
  'Pagamento da fatura',
  'Pagamento recebido',
  'Dinheiro guardado',
  'Dinheiro resgatado',
];

export type AppContextValue = {
  isLoading: boolean;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;
  date: Moment;
  setDate: (value: Moment) => void;
  lastUpdateDate: string;
  items: Item[];
  storeItem: (item: Item) => Promise<void>;
  fetchItems: () => Promise<void>;
  fetchingItems: boolean;
  updateItems: () => Promise<void>;
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
  totalBalance: number;
  totalInvoice: number;
  totalInvestment: number;
  totalIncomes: number;
  totalExpenses: number;
};

const AppContext = createContext({} as AppContextValue);

const now = moment();

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

  const pluggyService = usePluggyService();

  const isLoading =
    loadingItemsId ||
    fetchingItems ||
    fetchingAccounts ||
    fetchingInvestments ||
    fetchingTransactions;

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

  const totalIncomes = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) =>
          transaction.type === 'CREDIT' ? total + Math.abs(transaction.amount) : total,
        0,
      ),
    [transactions],
  );
  const totalExpenses = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) =>
          transaction.type === 'DEBIT' ? total + Math.abs(transaction.amount) : total,
        0,
      ),
    [transactions],
  );

  const storeItem = useCallback(
    async (item: Item) => {
      const newUniqueItems = [...new Set([...itemsId, item.id])];
      await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newUniqueItems));
      setItemsId(newUniqueItems);
    },
    [itemsId],
  );

  const fetchItems = useCallback(async () => {
    if (itemsId.length === 0) {
      return;
    }

    setFetchingItems(true);

    const itemList = await Promise.all(itemsId.map((id) => pluggyService.fetchItem(id)));

    setItems(itemList);

    setFetchingItems(false);
  }, [pluggyService, itemsId]);

  const updateItems = useCallback(async () => {
    setUpdatingItems(true);

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

    const updateDate = now.format(LastUpdateDateFormat);
    await AsyncStorage.setItem(LastUpdateDateStorageKey, updateDate);

    setLastUpdateDate(updateDate);
    setItems(itemList);

    setUpdatingItems(false);
  }, [pluggyService, itemsId]);

  const fetchAccounts = useCallback(async () => {
    if (items.length === 0) {
      return;
    }

    setFetchingAccounts(true);

    const result = await Promise.all(items.map(({ id }) => pluggyService.fetchAccounts(id)));

    const accountList = result.reduce((list, item) => [...list, ...item.results], [] as Account[]);

    setAccounts(accountList);

    setFetchingAccounts(false);
  }, [pluggyService, items]);

  const fetchInvestments = useCallback(async () => {
    if (items.length === 0) {
      return;
    }

    setFetchingInvestments(true);

    const result = await Promise.all(items.map(({ id }) => pluggyService.fetchInvestments(id)));

    const investmentList = result.reduce(
      (list, item) => [...list, ...item.results],
      [] as Investment[],
    );

    setInvestments(investmentList);

    setFetchingInvestments(false);
  }, [pluggyService, items]);

  const fetchTransactions = useCallback(async () => {
    if (accounts.length === 0) {
      return;
    }

    setFetchingTransactions(true);

    const startDate = moment(date).startOf('month');
    const endDate = moment(date).endOf('month');

    const result = await Promise.all(
      accounts.map(({ id }) =>
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

    setTransactions(transactionsList);

    setFetchingTransactions(false);
  }, [pluggyService, date, accounts]);

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

      if (shouldUpdate) {
        await updateItems();
      } else {
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

  return (
    <AppContext.Provider
      value={{
        isLoading,
        hideValues,
        setHideValues,
        date,
        setDate,
        lastUpdateDate,
        items,
        storeItem,
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
        totalBalance,
        totalInvoice,
        totalInvestment,
        totalIncomes,
        totalExpenses,
      }}
    >
      {children}
      {updatingItems && <LoadingModal text="Sincronizando conexões" />}
    </AppContext.Provider>
  );
};

export default AppContext;
