import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connect from '../pages/Connect';
import Home from '../pages/Home';
import Connections from '../pages/Connections';
import Transactions from '../pages/Transactions';

export type StackRouteParamList = {
  home: undefined;
  connections: undefined;
  connect: { updateItemId?: string };
  transactions: undefined;
};

const { Screen, Navigator, Group } = createNativeStackNavigator<StackRouteParamList>();

const StackRoutes: React.FC = () => {
  return (
    <Navigator>
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="home" component={Home} />
        <Screen name="connections" component={Connections} />
        <Screen name="connect" component={Connect} />
        <Screen name="transactions" component={Transactions} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
