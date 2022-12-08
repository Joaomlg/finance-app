import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';

const { Screen, Navigator } = createNativeStackNavigator();

const StackRoutes: React.FC = () => {
  return (
    <Navigator initialRouteName='Home'>
      <Screen
        name='Home'
        component={Home}
      />
    </Navigator>
  )
}

export default StackRoutes;