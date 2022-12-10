import React from 'react';
import { Text, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AccountInfo, AccountSection, Container, Header, ManageAccountButtonContainer, MonthSelector, UpdatedAt } from './styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Header>
        <MonthSelector>
          <Text>Maio</Text>
          <MaterialIcons name="expand-more" />
        </MonthSelector>
        <MaterialIcons name="refresh" />
      </Header>
      <UpdatedAt>Atualizado em: 09/12/2022 - 17:00</UpdatedAt>
      <AccountSection>
        <AccountInfo>
          <Text>Saldo das contas</Text>
          <Text>R$ 764</Text>
        </AccountInfo>
        <AccountInfo>
          <Text>Fatura dos cartões</Text>
          <Text>-R$ 322</Text>
        </AccountInfo>
        <AccountInfo>
          <Text>Investimentos</Text>
          <Text>R$ 1.903,32</Text>
        </AccountInfo>
        <AccountInfo>
          <Text>Total</Text>
          <Text>2.345,32</Text>
        </AccountInfo>
      </AccountSection>
      <ManageAccountButtonContainer>
        <Button title='Gerenciar contas' />
      </ManageAccountButtonContainer>
    </Container>
  );
}

export default Home;