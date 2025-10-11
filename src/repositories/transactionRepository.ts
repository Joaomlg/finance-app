import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Transaction } from '../models';
import { getTransactionSignedAmount } from '../utils/money';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { getBaseCollectionRef } from './common';
import { getTransactionalAccountReference } from './transactionalAccountRepository';

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
  accountId?: string;
  categoryId?: string;
};

export type SetTransactionOptions = {
  merge: boolean;
};

const TRANSACTIONS_FIREBASE_COLLECTION = 'transactions';

const getTransactionsCollectionReference = () =>
  getBaseCollectionRef().collection(getRepositoryName(TRANSACTIONS_FIREBASE_COLLECTION));

const buildColletionQuery = (options?: TransactionQueryOptions) => {
  let query: FirebaseFirestoreTypes.Query = getTransactionsCollectionReference();

  if (options?.interval) {
    query = query
      .where('date', '>=', options.interval.startDate)
      .where('date', '<=', options.interval.endDate);
  }

  if (options?.accountId) {
    query = query.where('accountId', '==', options.accountId);
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

    transaction.originalValues = { ...values };

    if (date) {
      // @ts-expect-error originalValues is defined
      transaction.originalValues.date = date.toDate();
    }
  }

  return transaction;
};

export const getTransactionReference = (id: string) => {
  const collection = getTransactionsCollectionReference();
  return collection.doc(id);
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
  const transactionalAccountReference = getTransactionalAccountReference(transaction.accountId);
  const transactionReference = getTransactionReference(transaction.id);

  await firestore().runTransaction(async (t) => {
    const transactionalAccountSnapshot = await t.get(transactionalAccountReference);

    if (!transactionalAccountSnapshot.exists) {
      throw 'TransactionalAccount does not exist!';
    }

    const transactionSnapshot = await t.get(transactionReference);

    if (transactionSnapshot.exists) {
      throw 'Transaction already exist!';
    }

    t.set(transactionReference, transaction);

    if (!transaction.updateAccountBalance) {
      return;
    }

    t.update(transactionalAccountReference, {
      balance: firestore.FieldValue.increment(getTransactionSignedAmount(transaction)),
    });
  });
};

export const securelySetTransactionsBatch = async (transactions: Transaction[]) =>
  setTransactionsBatch(transactions, { merge: true });

export const setTransactionsBatch = async (
  transactions: Transaction[],
  options = {} as SetTransactionOptions,
) => {
  const batch = firestore().batch();

  transactions.forEach((transaction) => {
    const transactionReference = getTransactionReference(transaction.id);
    batch.set(transactionReference, transaction, options);
  });

  return batch.commit();
};

export const updateTransaction = async (
  id: string,
  values: RecursivePartial<Transaction>,
  updateAccountBalance: boolean,
) => {
  const data = flattenObject(values);

  // undefined values mapped to firestore delete token
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      data[key] = firestore.FieldValue.delete();
    }
  });

  if (!updateAccountBalance || values.amount === undefined) {
    const collection = getTransactionsCollectionReference();
    return await collection.doc(id).update(data);
  }

  const collection = getTransactionsCollectionReference();
  const transactionReference = collection.doc(id);

  await firestore().runTransaction(async (t) => {
    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    const transactionalAccountReference = getTransactionalAccountReference(
      transactionSnapshot.data()?.accountId,
    );
    const transactionalAccountSnapshot = await t.get(transactionalAccountReference);

    if (!transactionalAccountSnapshot.exists) {
      throw 'TransactionalAccount does not exist!';
    }

    t.update(transactionReference, data).update(transactionalAccountReference, {
      balance: firestore.FieldValue.increment(
        // @ts-expect-error transaction and transactionSnapshot has amount
        getTransactionSignedAmount(values) - getTransactionSignedAmount(transactionSnapshot.data()),
      ),
    });
  });
};

export const deleteTransaction = async (transaction: Transaction) => {
  const transactionalAccountReference = getTransactionalAccountReference(transaction.accountId);
  const transactionReference = getTransactionReference(transaction.id);

  await firestore().runTransaction(async (t) => {
    const transactionalAccountSnapshot = await t.get(transactionalAccountReference);

    const transactionSnapshot = await t.get(transactionReference);

    if (!transactionSnapshot.exists) {
      throw 'Transaction does not exist!';
    }

    t.delete(transactionReference);

    if (!transaction.updateAccountBalance) {
      return;
    }

    if (transactionalAccountSnapshot.exists) {
      t.update(transactionalAccountReference, {
        balance: firestore.FieldValue.increment(-1 * getTransactionSignedAmount(transaction)),
      });
    }
  });
};

export const deleteAllTransactionsByAccountId = async (accountId: string) => {
  const collection = getTransactionsCollectionReference();
  const transactionsQuerySnapshot = await collection.where('accountId', '==', accountId).get();

  const batch = firestore().batch();

  transactionsQuerySnapshot.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });

  return batch.commit();
};

export const getLastTransactionalAccountTransaction = async (accountId: string) => {
  const result = await getTransactions({
    accountId,
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
