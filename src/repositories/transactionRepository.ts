import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Transaction } from '../models';
import { getTransactionSignedAmount } from '../utils/money';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { baseCollectionRef } from './common';
import { getWalletReference } from './walletRepository';

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
  count?: number;
  walletId?: string;
  categoryId?: string;
};

const TRANSACTIONS_FIREBASE_COLLECTION = 'transactions';

const transactionsCollection = baseCollectionRef.collection(
  getRepositoryName(TRANSACTIONS_FIREBASE_COLLECTION),
);

const buildColletionQuery = (options?: TransactionQueryOptions) => {
  let query: FirebaseFirestoreTypes.Query = transactionsCollection;

  if (options?.interval) {
    query = query
      .where('date', '>=', options.interval.startDate)
      .where('date', '<=', options.interval.endDate);
  }

  if (options?.walletId) {
    query = query.where('walletId', '==', options.walletId);
  }

  if (options?.categoryId) {
    query = query.where('categoryId', '==', options.categoryId);
  }

  if (options?.order) {
    query = query.orderBy(options.order.by, options.order.direction);
  }

  if (options?.count) {
    query = query.limit(options.count);
  }

  return query;
};

const parseTransaction = (data: FirebaseFirestoreTypes.DocumentData) => {
  const { date, originalValues, ...values } = data;

  const transaction = {
    ...values,
    date: date.toDate(),
  } as Transaction;

  if (originalValues) {
    const { date, ...values } = originalValues;
    transaction.originalValues = { ...values, date: date?.toDate() };
  }

  return transaction;
};

export const getTransactionReference = (id: string) => {
  return transactionsCollection.doc(id);
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
  const walletReference = getWalletReference(transaction.walletId);
  const transactionReference = getTransactionReference(transaction.id);

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
      balance: firestore.FieldValue.increment(getTransactionSignedAmount(transaction)),
    });
  });
};

export const setTransactionsBatch = async (transactions: Transaction[]) => {
  const batch = firestore().batch();

  transactions.forEach((transaction) => {
    const transactionReference = getTransactionReference(transaction.id);
    batch.set(transactionReference, transaction);
  });

  return batch.commit();
};

export const updateTransaction = async (id: string, values: RecursivePartial<Transaction>) => {
  const data = flattenObject(values);

  // undefined values mapped to firestore delete token
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      data[key] = firestore.FieldValue.delete();
    }
  });

  if (values.amount === undefined) {
    return await transactionsCollection.doc(id).update(data);
  }

  const transactionReference = transactionsCollection.doc(id);

  await firestore().runTransaction(async (t) => {
    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    const walletReference = getWalletReference(transactionSnapshot.data()?.walletId);
    const walletSnapshot = await t.get(walletReference);

    if (!walletSnapshot.exists) {
      throw 'Wallet does not exist!';
    }

    t.update(transactionReference, data).update(walletReference, {
      balance: firestore.FieldValue.increment(
        // @ts-expect-error transaction and transactionSnapshot has amount
        getTransactionSignedAmount(values) - getTransactionSignedAmount(transactionSnapshot.data()),
      ),
    });
  });
};

export const deleteTransaction = async (transaction: Transaction) => {
  const walletReference = getWalletReference(transaction.walletId);
  const transactionReference = getTransactionReference(transaction.id);

  await firestore().runTransaction(async (t) => {
    const walletSnapshot = await t.get(walletReference);

    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    t.delete(transactionReference);

    if (walletSnapshot.exists) {
      t.update(walletReference, {
        balance: firestore.FieldValue.increment(-1 * getTransactionSignedAmount(transaction)),
      });
    }
  });
};

export const deleteAllTransactionsByWalletId = async (walletId: string) => {
  const transactionsQuerySnapshot = await transactionsCollection
    .where('walletId', '==', walletId)
    .get();

  const batch = firestore().batch();

  transactionsQuerySnapshot.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });

  return batch.commit();
};

export const getLastWalletTransaction = async (walletId: string) => {
  const result = await getTransactions({
    walletId,
    order: {
      by: 'date',
      direction: 'desc',
    },
    count: 1,
  });

  if (result.length > 0) {
    return result[0];
  }
};
