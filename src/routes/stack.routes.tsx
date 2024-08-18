import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Connect from '../pages/Connect';
import BelvoConnect from '../pages/Connect/BelvoConnect';
import PluggyConnect from '../pages/Connect/PluggyConnect';
import ConnectionDetail from '../pages/ConnectionDetail';
import Connections from '../pages/Connections';
import History from '../pages/History';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ManualConnect from '../pages/ManualConnect';
import Settings from '../pages/Settings';
import Transactions from '../pages/Transactions';
import CreateAccount from '../pages/CreateAccount';

export type StackRouteParamList = {
  login: undefined;
  home: undefined;
  connections: undefined;
  'connection-detail': { connectionId: string };
  createAccount: undefined;
  connect: undefined;
  'connect/pluggy': { updateConnectionId?: string };
  'connect/belvo': { updateConnectionId?: string };
  manualConnect: undefined;
  transactions: undefined;
  history: undefined;
  settings: undefined;
};

const { Screen, Navigator, Group } = createNativeStackNavigator<StackRouteParamList>();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="login">
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="login" component={Login} />
        <Screen name="home" component={Home} />
        <Screen name="connections" component={Connections} />
        <Screen name="createAccount" component={CreateAccount} />
        <Screen name="connection-detail" component={ConnectionDetail} />
        <Screen name="connect" component={Connect} />
        <Screen name="connect/pluggy" component={PluggyConnect} />
        <Screen name="connect/belvo" component={BelvoConnect} />
        <Screen name="manualConnect" component={ManualConnect} />
        <Screen name="transactions" component={Transactions} />
        <Screen name="history" component={History} />
        <Screen name="settings" component={Settings} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
