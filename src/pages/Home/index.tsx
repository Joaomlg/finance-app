import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Container } from './styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemsAsyncStorageKey } from '../../utils/contants';
import usePluggyService from '../../hooks/pluggyService';
import moment from 'moment';
import { Box, Fab, Icon, VStack, Text, HStack, Divider } from 'native-base';

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
        <VStack space={3}>
          <Text fontSize="xs" fontWeight="thin">
            Atualizado em: {lastUpdate}
          </Text>
          <Box borderWidth="1" borderColor="coolGray.200" borderRadius="lg">
            <VStack padding={4} space={3}>
              <Text fontSize="md" fontWeight="extrabold">
                Balanço
              </Text>
              <HStack justifyContent="space-between">
                <Text>Saldo das contas</Text>
                <Text>R$ {formatMoney(totalBalance)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text>Fatura dos cartões</Text>
                <Text>-R$ {formatMoney(totalInvoice)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text>Investimentos</Text>
                <Text>R$ {formatMoney(totalInvestment)}</Text>
              </HStack>
              <Divider />
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">R$ {formatMoney(totalValue)}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Container>
  );
};

export default Home;
