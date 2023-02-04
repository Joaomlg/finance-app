import React from 'react';
import Home from '../pages/Home';
import Connections from '../pages/Connections';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Transactions from '../pages/Transactions';

const { Screen, Navigator } = createBottomTabNavigator();

const TabsRoutes: React.FC = () => {
  return (
    <Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarItemStyle: { marginVertical: 5 },
        headerShown: false,
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={20} color={color} />,
        }}
      />
      <Screen
        name="connections"
        component={Connections}
        options={{
          title: 'Conexões',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-balance" size={20} color={color} />
          ),
        }}
      />
      <Screen
        name="transactions"
        component={Transactions}
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => <MaterialIcons name="payments" size={20} color={color} />,
        }}
      />
    </Navigator>
  );
};

export default TabsRoutes;
