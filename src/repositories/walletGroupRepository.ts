import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { WalletGroup } from '../models';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { getBaseCollectionRef } from './common';

const WALLET_GROUPS_FIREBASE_COLLECTION = 'walletGroups';

const getWalletGroupsCollectionReference = () =>
  getBaseCollectionRef().collection(getRepositoryName(WALLET_GROUPS_FIREBASE_COLLECTION));

const parseWalletGroup = (data: FirebaseFirestoreTypes.DocumentData) => {
  const values = { ...data };

  if (values.createdAt) {
    values.createdAt = values.createdAt.toDate();
  }

  if (values.type === 'AUTOMATIC' && values.lastUpdatedAt) {
    values.lastUpdatedAt = values.lastUpdatedAt.toDate();
  }

  return values as WalletGroup;
};

export const getWalletGroups = async () => {
  const collection = getWalletGroupsCollectionReference();
  const result = await collection.get();
  return result.docs.map((item) => parseWalletGroup(item.data()));
};

export const onWalletGroupsChange = (callback: (walletGroups: WalletGroup[]) => void) => {
  const collection = getWalletGroupsCollectionReference();
  const unsubscribe = collection.onSnapshot((snap) => {
    const walletGroups = snap.docs.map((item) => parseWalletGroup(item.data()));
    callback(walletGroups);
  });
  return unsubscribe;
};

export const getWalletGroupReference = (id: string) => {
  const collection = getWalletGroupsCollectionReference();
  return collection.doc(id);
};

export const setWalletGroup = async (walletGroup: WalletGroup) => {
  const collection = getWalletGroupsCollectionReference();
  await collection.doc(walletGroup.id).set(walletGroup);
};

export const updateWalletGroup = async (id: string, values: RecursivePartial<WalletGroup>) => {
  const collection = getWalletGroupsCollectionReference();
  const data = flattenObject(values);
  await collection.doc(id).update(data);
};

export const deleteWalletGroup = async (walletGroup: WalletGroup) => {
  const collection = getWalletGroupsCollectionReference();
  await collection.doc(walletGroup.id).delete();
};
