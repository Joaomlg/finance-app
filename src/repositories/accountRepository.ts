import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { BankAccount } from '../models';
import { Account } from '../services/pluggy';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { getBaseCollectionRef } from './common';

const ACCOUNTS_FIREBASE_COLLECTION = 'accounts';

const getAccountsCollectionReference = () =>
  getBaseCollectionRef().collection(getRepositoryName(ACCOUNTS_FIREBASE_COLLECTION));

const parseAccount = (data: FirebaseFirestoreTypes.DocumentData) => {
  const { createdAt, ...values } = data;

  const connection = values.connection;
  if (connection) {
    connection.lastUpdatedAt = connection.lastUpdatedAt.toDate();
  }

  return {
    ...values,
    createdAt: createdAt.toDate(),
  } as BankAccount;
};

export const getAccounts = async () => {
  const collection = getAccountsCollectionReference();
  const result = await collection.get();
  return result.docs.map((item) => parseAccount(item.data()));
};

export const onAccountsChange = (callback: (accounts: BankAccount[]) => void) => {
  const collection = getAccountsCollectionReference();
  const unsubscribe = collection.onSnapshot((snap) => {
    const accounts = snap.docs.map((item) => parseAccount(item.data()));
    callback(accounts);
  });
  return unsubscribe;
};

export const getAccountReference = (id: string) => {
  const collection = getAccountsCollectionReference();
  return collection.doc(id);
};

export const setAccount = async (account: BankAccount) => {
  const collection = getAccountsCollectionReference();
  await collection.doc(account.id).set(account);
};

export const setAccountsBatch = async (accounts: BankAccount[]) => {
  const batch = firestore().batch();

  accounts.forEach((account) => {
    const accountReference = getAccountReference(account.id);
    batch.set(accountReference, account);
  });

  return batch.commit();
};

export const updateAccount = async (id: string, values: RecursivePartial<BankAccount>) => {
  const collection = getAccountsCollectionReference();
  const data = flattenObject(values);
  await collection.doc(id).update(data);
};

export const updateAccountsBatch = async (accounts: Account[]) => {
  const batch = firestore().batch();

  accounts.forEach((account) => {
    const accountReference = getAccountReference(account.id);
    const data = flattenObject(account);
    batch.update(accountReference, data);
  });

  return batch.commit();
};

export const deleteAccount = async (account: Account) => {
  const collection = getAccountsCollectionReference();
  await collection.doc(account.id).delete();
};
