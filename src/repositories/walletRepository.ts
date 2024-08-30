import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Wallet } from '../models';
import { RecursivePartial } from '../utils/type';

const WALLETS_FIREBASE_COLLECTION = 'wallets';

const walletsCollection = firestore().collection(WALLETS_FIREBASE_COLLECTION);

const parseWallet = (data: FirebaseFirestoreTypes.DocumentData) => {
  const { createdAt, ...values } = data;
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

export const updateWallet = async (id: string, values: RecursivePartial<Wallet>) => {
  await walletsCollection.doc(id).update(values);
};

export const deleteWallet = async (wallet: Wallet) => {
  await walletsCollection.doc(wallet.id).delete();
};
