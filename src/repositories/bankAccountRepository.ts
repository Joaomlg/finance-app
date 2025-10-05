import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { BankAccount } from '../models';
import { Account } from '../services/pluggy';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { getBaseCollectionRef } from './common';

const ACCOUNTS_FIREBASE_COLLECTION = 'accounts';

const getBankAccountsCollectionReference = () =>
  getBaseCollectionRef().collection(getRepositoryName(ACCOUNTS_FIREBASE_COLLECTION));

const parseBankAccount = (data: FirebaseFirestoreTypes.DocumentData) => {
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

export const getBankAccounts = async () => {
  const collection = getBankAccountsCollectionReference();
  const result = await collection.get();
  return result.docs.map((item) => parseBankAccount(item.data()));
};

export const onBankAccountsChange = (callback: (accounts: BankAccount[]) => void) => {
  const collection = getBankAccountsCollectionReference();
  const unsubscribe = collection.onSnapshot((snap) => {
    const accounts = snap.docs.map((item) => parseBankAccount(item.data()));
    callback(accounts);
  });
  return unsubscribe;
};

export const getBankAccountReference = (id: string) => {
  const collection = getBankAccountsCollectionReference();
  return collection.doc(id);
};

export const setBankAccount = async (account: BankAccount) => {
  const collection = getBankAccountsCollectionReference();
  await collection.doc(account.id).set(account);
};

export const updateBankAccount = async (id: string, values: RecursivePartial<BankAccount>) => {
  const collection = getBankAccountsCollectionReference();
  const data = flattenObject(values);
  await collection.doc(id).update(data);
};

export const deleteBankAccount = async (account: Account) => {
  const collection = getBankAccountsCollectionReference();
  await collection.doc(account.id).delete();
};
