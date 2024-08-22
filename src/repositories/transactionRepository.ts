import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Transaction } from '../models';

type DateInterval = {
  startDate: Date;
  endDate: Date;
};

type Order = {
  by: keyof Transaction;
  direction: 'asc' | 'desc';
};

export type TransactionQueryOptions = {
  interval?: DateInterval;
  order?: Order;
};

const transactionsCollection = firestore().collection('transactions');

const buildColletionQuery = (options?: TransactionQueryOptions) => {
  let query: FirebaseFirestoreTypes.Query = transactionsCollection;

  if (options?.interval) {
    query = query
      .where('date', '>=', options.interval.startDate)
      .where('date', '<=', options.interval.endDate);
  }

  if (options?.order) {
    query = query.orderBy(options.order.by, options.order.direction);
  }

  return query;
};

const parseTransaction = (data: FirebaseFirestoreTypes.DocumentData) => {
  const { date, ...values } = data;
  return {
    ...values,
    date: date.toDate(),
  } as Transaction;
};

export const getTransactions = async (options?: TransactionQueryOptions) => {
  const result = await buildColletionQuery(options).get();
  return result.docs.map((item) => parseTransaction(item.data()));
};

export const onTransactionsChange = (
  callback: (transactions: Transaction[]) => void,
  options?: TransactionQueryOptions,
) => {
  const unsubscribe = buildColletionQuery(options).onSnapshot((snap) => {
    const transactions = snap.docs.map((item) => parseTransaction(item.data()));
    callback(transactions);
  });

  return unsubscribe;
};

export const setTransaction = async (transaction: Transaction) => {
  await transactionsCollection.doc(transaction.id).set(transaction);
};

export const updateTransaction = async (id: string, values: Partial<Transaction>) => {
  await transactionsCollection.doc(id).update(values);
};

export const deleteTransaction = async (transaction: Transaction) => {
  await transactionsCollection.doc(transaction.id).delete();
};
