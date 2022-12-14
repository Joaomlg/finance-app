import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Box, Divider, HStack, Icon, Text, VStack } from 'native-base';
import usePluggyService from '../../hooks/pluggyService';
import { ItemsAsyncStorageKey, LastUpdateDateStorageKey } from '../../utils/contants';
import { formatMoney } from '../../utils/money';
import { Container, VersionTag } from './styles';

const lastUpdateDateFormat = 'DD/MM/YYYY HH:mm:ss';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [hideMoney, setHideMoney] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);

  const pluggyService = usePluggyService();

  const fetchData = useCallback(
    async (forceUpdate = false) => {
      setIsLoading(true);

      const itemsId: string[] = JSON.parse(
        (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
      );

      let lastUpdateDate = await AsyncStorage.getItem(LastUpdateDateStorageKey);
      const now = moment();

      const shouldUpdate = lastUpdateDate
        ? now.isAfter(moment(lastUpdateDate, lastUpdateDateFormat), 'day')
        : true;

      if (shouldUpdate || forceUpdate) {
        await Promise.all(itemsId.map((id) => pluggyService.updateItem(id)));
        lastUpdateDate = now.format(lastUpdateDateFormat);
        await AsyncStorage.setItem(LastUpdateDateStorageKey, lastUpdateDate);
      }

      setLastUpdate(lastUpdateDate as string);

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

      const investiments = await Promise.all(
        itemsId.map((id) => pluggyService.fetchInvestments(id)),
      );

      setTotalInvestment(
        investiments.reduce(
          (total, { results }) => total + results.reduce((acc, item) => acc + item.balance, 0),
          0,
        ),
      );

      setIsLoading(false);
    },
    [pluggyService],
  );

  const handleUpdateData = async () => {
    await fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalValue = totalBalance + totalInvestment - totalInvoice;

  return (
    <Container>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleUpdateData} />}
      >
        <VStack space={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xs" fontWeight="thin">
              Atualizado em: {lastUpdate}
            </Text>
            <Icon
              as={MaterialIcons}
              name={hideMoney ? 'visibility-off' : 'visibility'}
              size="md"
              onPress={() => setHideMoney(!hideMoney)}
            />
          </HStack>
          <Box borderWidth="1" borderColor="coolGray.200" borderRadius="lg">
            <VStack padding={4} space={3}>
              <Text fontSize="md" fontWeight="extrabold">
                Balan??o
              </Text>
              <HStack justifyContent="space-between">
                <Text>Saldo das contas</Text>
                <Text>R$ {formatMoney({ value: totalBalance, hidden: hideMoney })}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text>Fatura dos cart??es</Text>
                <Text>-R$ {formatMoney({ value: totalInvoice, hidden: hideMoney })}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text>Investimentos</Text>
                <Text>R$ {formatMoney({ value: totalInvestment, hidden: hideMoney })}</Text>
              </HStack>
              <Divider />
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">
                  R$ {formatMoney({ value: totalValue, hidden: hideMoney })}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
      <VersionTag>v1.0.5</VersionTag>
    </Container>
  );
};

export default Home;
