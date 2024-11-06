import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Wallet } from '../models';
import { flattenObject } from '../utils/object';
import { getRepositoryName } from '../utils/repository';
import { RecursivePartial } from '../utils/type';
import { baseCollectionRef } from './common';

const WALLETS_FIREBASE_COLLECTION = 'wallets';

const walletsCollection = baseCollectionRef.collection(
  getRepositoryName(WALLETS_FIREBASE_COLLECTION),
);

const parseWallet = (data: FirebaseFirestoreTypes.DocumentData) => {
  const { createdAt, ...values } = data;

  const connection = values.connection;
  if (connection) {
    connection.lastUpdatedAt = connection.lastUpdatedAt.toDate();
  }

  return {
    ...values,
    createdAt: createdAt.toDate(),
  } as Wallet;
};

export const getWallets = async () => {
  const result = await walletsCollection.get();
  return result.docs.map((item) => parseWallet(item.data()));
};

export const onWalletsChange = (callback: (wallets: Wallet[]) => void) => {
  const unsubscribe = walletsCollection.onSnapshot((snap) => {
    const wallets = snap.docs.map((item) => parseWallet(item.data()));
    callback(wallets);
  });
  return unsubscribe;
};

export const getWalletReference = (id: string) => {
  return walletsCollection.doc(id);
};

export const setWallet = async (wallet: Wallet) => {
  await walletsCollection.doc(wallet.id).set(wallet);
};

export const setWalletsBatch = async (wallets: Wallet[]) => {
  const batch = firestore().batch();

  wallets.forEach((wallet) => {
    const walletReference = getWalletReference(wallet.id);
    batch.set(walletReference, wallet);
  });

  return batch.commit();
};

export const updateWallet = async (id: string, values: RecursivePartial<Wallet>) => {
  const data = flattenObject(values);
  await walletsCollection.doc(id).update(data);
};

export const updateWalletsBatch = async (wallets: Wallet[]) => {
  const batch = firestore().batch();

  wallets.forEach((wallet) => {
    const walletReference = getWalletReference(wallet.id);
    const data = flattenObject(wallet);
    batch.update(walletReference, data);
  });

  return batch.commit();
};

export const deleteWallet = async (wallet: Wallet) => {
  await walletsCollection.doc(wallet.id).delete();
};
