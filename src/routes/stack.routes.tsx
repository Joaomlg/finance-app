import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Accounts from '../pages/Accounts';
import Connect from '../pages/Connect';

const { Screen, Navigator, Group } = createNativeStackNavigator();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="home">
      <Screen name="home" component={Home} options={{ title: 'Home' }} />
      <Screen name="accounts" component={Accounts} options={{ title: 'Conexões' }} />
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="connect" component={Connect} />
      </Group>
    </Navigator>
  );
};

export default StackRoutes;
