import firestore from '@react-native-firebase/firestore';
import { Wallet } from '../models';

const walletsCollection = firestore().collection('wallets');

export const getWallets = async () => {
  const result = await walletsCollection.get();
  return result.docs.map((item) => item.data() as Wallet);
};

export const onWalletsChange = (callback: (wallets: Wallet[]) => void) => {
  const unsubscribe = walletsCollection.onSnapshot((snap) => {
    const wallets = snap.docs.map((item) => item.data() as Wallet);
    callback(wallets);
  });
  return unsubscribe;
};

export const setWallet = async (account: Wallet) => {
  await walletsCollection.doc(account.id).set(account);
};

export const deleteWallet = async (account: Wallet) => {
  await walletsCollection.doc(account.id).delete();
};
