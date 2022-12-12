import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';

import { Container } from './styles';

const Accounts: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <Button title="Conectar uma conta" onPress={() => navigation.navigate('connect')}></Button>
    </Container>
  );
};

export default Accounts;
