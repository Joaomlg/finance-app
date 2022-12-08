import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text } from 'react-native';

import { Container } from './styles';

const Home: React.FC = () => {
  return (
    <Container>
      <StatusBar style="auto" />
      <Text>Home</Text>
    </Container>
  );
}

export default Home;