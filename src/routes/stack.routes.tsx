import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connect from '../pages/Connect';
import TabsRoutes from './tabs.routes';

const { Screen, Navigator, Group } = createNativeStackNavigator();

const StackRoutes: React.FC = () => {
  return (
    <Navigator>
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="tabs" component={TabsRoutes} />
        <Screen name="connect" component={Connect} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
