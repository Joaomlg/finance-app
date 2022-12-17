import React, { useCallback, useEffect, useState } from 'react';
import { Text, Button, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  AccountInfo,
  AccountSection,
  Container,
  Header,
  ManageAccountButtonContainer,
  MonthSelector,
  UpdatedAt,
} from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemsAsyncStorageKey } from '../../utils/contants';
import usePluggyService from '../../hooks/pluggyService';
import moment from 'moment';
import { Fab, Icon, Select } from 'native-base';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);

  const navigation = useNavigation();

  const pluggyService = usePluggyService();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const itemsId: string[] = JSON.parse(
      (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
    );

    const accounts = await Promise.all(itemsId.map((id) => pluggyService.fetchAccounts(id)));

    setTotalBalance(
      accounts.reduce(
        (total, { results }) =>
          total +
          results
            .filter((item) => item.type == 'BANK')
            .reduce((acc, item) => acc + item.balance, 0),
        0,
      ),
    );

    setTotalInvoice(
      accounts.reduce(
        (total, { results }) =>
          total +
          results
            .filter((item) => item.type == 'CREDIT')
            .reduce((acc, item) => acc + item.balance, 0),
        0,
      ),
    );

    const investiments = await Promise.all(itemsId.map((id) => pluggyService.fetchInvestments(id)));

    setTotalInvestment(
      investiments.reduce(
        (total, { results }) => total + results.reduce((acc, item) => acc + item.balance, 0),
        0,
      ),
    );

    const nowString = moment().format('DD/MM/YYYY hh:mm:ss');
    setLastUpdate(nowString);

    setIsLoading(false);
  }, [pluggyService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalValue = totalBalance + totalInvestment - totalInvoice;

  const formatMoney = (value: number) => {
    return value
      .toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  return (
    <Container>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
        <UpdatedAt>Atualizado em: {lastUpdate}</UpdatedAt>
        <AccountSection>
          <AccountInfo>
            <Text>Saldo das contas</Text>
            <Text>R$ {formatMoney(totalBalance)}</Text>
          </AccountInfo>
          <AccountInfo>
            <Text>Fatura dos cartões</Text>
            <Text>-R$ {formatMoney(totalInvoice)}</Text>
          </AccountInfo>
          <AccountInfo>
            <Text>Investimentos</Text>
            <Text>R$ {formatMoney(totalInvestment)}</Text>
          </AccountInfo>
          <AccountInfo>
            <Text>Total</Text>
            <Text>R$ {formatMoney(totalValue)}</Text>
          </AccountInfo>
        </AccountSection>
      </ScrollView>
      <Fab
        renderInPortal={false}
        size="lg"
        icon={<Icon name="account-balance" as={MaterialIcons} color="white" />}
        label="Contas"
        onPress={() => navigation.navigate('accounts')}
      />
    </Container>
  );
};

export default Home;
