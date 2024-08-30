import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Transaction } from '../models';
import { getTransactionSignedAmount } from '../utils/money';
import { RecursivePartial } from '../utils/type';
import { walletsCollection } from './walletRepository';

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

const TRANSACTIONS_FIREBASE_COLLECTION = 'transactions';

export const transactionsCollection = firestore().collection(TRANSACTIONS_FIREBASE_COLLECTION);

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
  const walletReference = walletsCollection.doc(transaction.walletId);
  const transactionReference = transactionsCollection.doc(transaction.id);

  await firestore().runTransaction(async (t) => {
    const walletSnapshot = await t.get(walletReference);

    if (!walletSnapshot.exists) {
      throw 'Wallet does not exist!';
    }

    const transactionSnapshot = await t.get(transactionReference);

    if (transactionSnapshot.exists) {
      throw 'Transaction already exist!';
    }

    t.set(transactionReference, transaction).update(walletReference, {
      balance: walletSnapshot.data()?.balance + getTransactionSignedAmount(transaction),
    });
  });
};

export const updateTransaction = async (id: string, values: RecursivePartial<Transaction>) => {
  if (values.amount === undefined) {
    return await transactionsCollection.doc(id).update(values);
  }

  const transactionReference = transactionsCollection.doc(id);

  await firestore().runTransaction(async (t) => {
    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    const walletReference = walletsCollection.doc(transactionSnapshot.data()?.walletId);
    const walletSnapshot = await t.get(walletReference);

    if (!walletSnapshot.exists) {
      throw 'Wallet does not exist!';
    }

    t.update(transactionReference, values).update(walletReference, {
      balance:
        walletSnapshot.data()?.balance -
        // @ts-expect-error transaction snapshot exists
        getTransactionSignedAmount(transactionSnapshot.data()) +
        // @ts-expect-error transaction has amount
        getTransactionSignedAmount(values),
    });
  });
};

export const deleteTransaction = async (transaction: Transaction) => {
  const walletReference = walletsCollection.doc(transaction.walletId);
  const transactionReference = transactionsCollection.doc(transaction.id);

  await firestore().runTransaction(async (t) => {
    const walletSnapshot = await t.get(walletReference);

    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    t.delete(transactionReference);

    if (walletSnapshot.exists) {
      t.update(walletReference, {
        balance: walletSnapshot.data()?.balance - getTransactionSignedAmount(transaction),
      });
    }
  });
};
