import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Categories from '../pages/Categories';
import Connect from '../pages/Connect';
import BelvoConnect from '../pages/Connect/BelvoConnect';
import PluggyConnect from '../pages/Connect/PluggyConnect';
import History from '../pages/History';
import Home from '../pages/Home';
import Insights from '../pages/Insights';
import Login from '../pages/Login';
import ManualConnect from '../pages/ManualConnect';
import Settings from '../pages/Settings';
import SetTransaction from '../pages/SetTransaction';
import SetWallet from '../pages/SetWallet';
import TransactionDetail from '../pages/TransactionDetail';
import Transactions from '../pages/Transactions';
import WalletDetail from '../pages/WalletDetail';
import Wallets from '../pages/Wallets';
import CategoryHistory from '../pages/CategoryHistory';

export type StackRouteParamList = {
  login: undefined;
  home: undefined;
  wallets: undefined;
  wallet: { walletId: string };
  setWallet: { walletId?: string } | undefined;
  connect: undefined;
  'connect/pluggy': { updateConnectionId?: string };
  'connect/belvo': { updateConnectionId?: string };
  manualConnect: undefined;
  transactions: { categoryId?: string } | undefined;
  transaction: { transactionId: string };
  setTransaction: { transactionType: string; transactionId?: string };
  history: undefined;
  settings: undefined;
  categories: undefined;
  insights: undefined;
  categoryHistory: { categoryId: string };
};

const { Screen, Navigator, Group } = createNativeStackNavigator<StackRouteParamList>();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="login">
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="login" component={Login} />
        <Screen name="home" component={Home} />
        <Screen name="wallets" component={Wallets} />
        <Screen name="setWallet" component={SetWallet} />
        <Screen name="wallet" component={WalletDetail} />
        <Screen name="connect" component={Connect} />
        <Screen name="connect/pluggy" component={PluggyConnect} />
        <Screen name="connect/belvo" component={BelvoConnect} />
        <Screen name="manualConnect" component={ManualConnect} />
        <Screen name="transactions" component={Transactions} />
        <Screen name="transaction" component={TransactionDetail} />
        <Screen name="setTransaction" component={SetTransaction} />
        <Screen name="history" component={History} />
        <Screen name="settings" component={Settings} />
        <Screen name="categories" component={Categories} />
        <Screen name="insights" component={Insights} />
        <Screen name="categoryHistory" component={CategoryHistory} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
