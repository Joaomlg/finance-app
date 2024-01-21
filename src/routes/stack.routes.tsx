import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Connect from '../pages/Connect';
import BelvoConnect from '../pages/Connect/BelvoConnect';
import PluggyConnect from '../pages/Connect/PluggyConnect';
import ConnectionDetail from '../pages/ConnectionDetail';
import Connections from '../pages/Connections';
import History from '../pages/History';
import Home from '../pages/Home';
import ManualConnect from '../pages/ManualConnect';
import Transactions from '../pages/Transactions';

export type StackRouteParamList = {
  home: undefined;
  connections: undefined;
  'connection-detail': { connectionId: string };
  connect: undefined;
  'connect/pluggy': { updateConnectionId?: string };
  'connect/belvo': { updateConnectionId?: string };
  manualConnect: undefined;
  transactions: undefined;
  history: undefined;
};

const { Screen, Navigator, Group } = createNativeStackNavigator<StackRouteParamList>();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="home">
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="home" component={Home} />
        <Screen name="connections" component={Connections} />
        <Screen name="connection-detail" component={ConnectionDetail} />
        <Screen name="connect" component={Connect} />
        <Screen name="connect/pluggy" component={PluggyConnect} />
        <Screen name="connect/belvo" component={BelvoConnect} />
        <Screen name="manualConnect" component={ManualConnect} />
        <Screen name="transactions" component={Transactions} />
        <Screen name="history" component={History} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
