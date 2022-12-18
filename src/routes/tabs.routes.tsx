import React from 'react';
import Home from '../pages/Home';
import Connections from '../pages/Connections';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const { Screen, Navigator } = createBottomTabNavigator();

const TabsRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName="home">
      <Screen
        name="home"
        component={Home}
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Icon name="home" size="md" color={color} as={MaterialIcons} />
          ),
        }}
      />
      <Screen
        name="connections"
        component={Connections}
        options={{
          title: 'Conexões',
          tabBarIcon: ({ color }) => (
            <Icon name="account-balance" size="md" color={color} as={MaterialIcons} />
          ),
        }}
      />
    </Navigator>
  );
};

export default TabsRoutes;
