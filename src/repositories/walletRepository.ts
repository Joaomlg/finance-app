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

export const setWallet = async (wallet: Wallet) => {
  await walletsCollection.doc(wallet.id).set(wallet);
};

export const updateWallet = async (id: string, values: Partial<Wallet>) => {
  await walletsCollection.doc(id).update(values);
};

export const deleteWallet = async (wallet: Wallet) => {
  await walletsCollection.doc(wallet.id).delete();
};
