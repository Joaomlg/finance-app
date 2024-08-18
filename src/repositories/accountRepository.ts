import firestore from '@react-native-firebase/firestore';
import { NewAccount } from '../models';

const accountsCollection = firestore().collection('accounts');

export const getAccounts = async () => {
  const result = await accountsCollection.get();
  return result.docs.map((item) => item.data() as NewAccount);
};

export const onAccountsChange = (callback: (accounts: NewAccount[]) => void) => {
  const unsubscribe = accountsCollection.onSnapshot((snap) => {
    const accounts = snap.docs.map((item) => item.data() as NewAccount);
    callback(accounts);
  });
  return unsubscribe;
};

export const setAccount = async (account: NewAccount) => {
  await accountsCollection.add(account);
};

export const deleteAccount = async (account: NewAccount) => {
  await accountsCollection.doc(account.id).delete();
};
