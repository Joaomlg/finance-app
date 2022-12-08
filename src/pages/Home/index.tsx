import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { styles } from './styles';

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Home</Text>
    </View>
  );
}

export default Home;