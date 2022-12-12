import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Accounts from '../pages/Accounts';
import Connect from '../pages/Connect';

const { Screen, Navigator } = createNativeStackNavigator();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="home">
      <Screen name="home" component={Home} />

      <Screen name="accounts" component={Accounts} />

      <Screen name="connect" component={Connect} />
    </Navigator>
  );
};

export default StackRoutes;
