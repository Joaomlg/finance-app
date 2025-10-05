import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TransactionalAccount } from '../models';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { getBaseCollectionRef } from './common';

const TRANSACTIONALACCOUNTS_FIREBASE_COLLECTION = 'transactionalaccounts';

const getTransactionalAccountsCollectionReference = () =>
  getBaseCollectionRef().collection(getRepositoryName(TRANSACTIONALACCOUNTS_FIREBASE_COLLECTION));

const parseTransactionalAccount = (data: FirebaseFirestoreTypes.DocumentData) => {
  return data as TransactionalAccount;
};

export const getTransactionalAccounts = async () => {
  const collection = getTransactionalAccountsCollectionReference();
  const result = await collection.get();
  return result.docs.map((item) => parseTransactionalAccount(item.data()));
};

export const onTransactionalAccountsChange = (
  callback: (transactionalaccounts: TransactionalAccount[]) => void,
) => {
  const collection = getTransactionalAccountsCollectionReference();
  const unsubscribe = collection.onSnapshot((snap) => {
    const transactionalaccounts = snap.docs.map((item) => parseTransactionalAccount(item.data()));
    callback(transactionalaccounts);
  });
  return unsubscribe;
};

export const getTransactionalAccountReference = (id: string) => {
  const collection = getTransactionalAccountsCollectionReference();
  return collection.doc(id);
};

export const setTransactionalAccount = async (transactionalaccount: TransactionalAccount) => {
  const collection = getTransactionalAccountsCollectionReference();
  await collection.doc(transactionalaccount.id).set(transactionalaccount);
};

export const setTransactionalAccountsBatch = async (
  transactionalaccounts: TransactionalAccount[],
) => {
  const batch = firestore().batch();

  transactionalaccounts.forEach((transactionalaccount) => {
    const transactionalaccountReference = getTransactionalAccountReference(transactionalaccount.id);
    batch.set(transactionalaccountReference, transactionalaccount);
  });

  return batch.commit();
};

export const updateTransactionalAccount = async (
  id: string,
  values: RecursivePartial<TransactionalAccount>,
) => {
  const collection = getTransactionalAccountsCollectionReference();
  const data = flattenObject(values);
  await collection.doc(id).update(data);
};

export const updateTransactionalAccountsBatch = async (
  transactionalaccounts: TransactionalAccount[],
) => {
  const batch = firestore().batch();

  transactionalaccounts.forEach((transactionalaccount) => {
    const transactionalaccountReference = getTransactionalAccountReference(transactionalaccount.id);
    const data = flattenObject(transactionalaccount);
    batch.update(transactionalaccountReference, data);
  });

  return batch.commit();
};

export const deleteTransactionalAccount = async (transactionalaccount: TransactionalAccount) => {
  const collection = getTransactionalAccountsCollectionReference();
  await collection.doc(transactionalaccount.id).delete();
};
