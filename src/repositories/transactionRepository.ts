import firestore from '@react-native-firebase/firestore';
import { Transaction } from '../models';

export type DateInterval = {
  startDate: Date;
  endDate: Date;
};

const transactionsCollection = firestore().collection('transactions');

export const getTransactions = async () => {
  const result = await transactionsCollection.get();
  return result.docs.map((item) => item.data() as Transaction);
};

export const onTransactionsChange = (
  callback: (transactions: Transaction[]) => void,
  options?: { interval: DateInterval },
) => {
  const colletion = options?.interval
    ? transactionsCollection
        .where('date', '>=', options.interval.startDate)
        .where('date', '<=', options.interval.endDate)
    : transactionsCollection;

  const unsubscribe = colletion.onSnapshot((snap) => {
    const transactions = snap.docs.map((item) => item.data() as Transaction);
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
