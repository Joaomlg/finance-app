import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Connect from '../pages/Connect/PluggyConnect';
import Connections from '../pages/Connections';
import History from '../pages/History';
import Home from '../pages/Home';
import Transactions from '../pages/Transactions';
import ManualConnect from '../pages/ManualConnect';

export type StackRouteParamList = {
  home: undefined;
  connections: undefined;
  connect: { updateConnectionId?: string };
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
        <Screen name="connect" component={Connect} />
        <Screen name="manualConnect" component={ManualConnect} />
        <Screen name="transactions" component={Transactions} />
        <Screen name="history" component={History} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
