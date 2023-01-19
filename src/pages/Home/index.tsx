import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Box, Divider, HStack, Icon, Text, VStack } from 'native-base';
import usePluggyService from '../../hooks/pluggyService';
import { Account, Investment } from '../../services/pluggy';
import { ItemsAsyncStorageKey, LastUpdateDateStorageKey } from '../../utils/contants';
import { formatMoney } from '../../utils/money';
import { sleep } from '../../utils/time';
import {
  Container,
  Content,
  UpdatingToastActivityIndicator,
  UpdatingToastContainer,
  UpdatingToastContent,
  UpdatingToastSubtitle,
  UpdatingToastTitle,
  VersionTag,
} from './styles';

const lastUpdateDateFormat = 'DD/MM/YYYY HH:mm:ss';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [hideMoney, setHideMoney] = useState(false);
  const [accounts, setAccounts] = useState([] as Account[]);
  const [investments, setInvestments] = useState([] as Investment[]);

  const pluggyService = usePluggyService();

  const totalBalance = useMemo(
    () =>
      accounts
        .filter(({ type }) => type === 'BANK')
        .reduce((total, { balance }) => total + balance, 0),
    [accounts],
  );

  const totalInvoice = useMemo(
    () =>
      accounts
        .filter(({ type }) => type === 'CREDIT')
        .reduce((total, { balance }) => total + balance, 0),
    [accounts],
  );

  const totalInvestment = useMemo(
    () => investments.reduce((total, { balance }) => total + balance, 0),
    [investments],
  );

  const updateItemAndWaitForFinish = useCallback(
    async (itemId: string) => {
      let item = await pluggyService.updateItem(itemId);

      while (item.status === 'UPDATING') {
        await sleep(2000);
        item = await pluggyService.fetchItem(itemId);
      }

      return item;
    },
    [pluggyService],
  );

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
        setIsUpdating(true);

        await Promise.all(itemsId.map((id) => updateItemAndWaitForFinish(id)));

        lastUpdateDate = now.format(lastUpdateDateFormat);
        await AsyncStorage.setItem(LastUpdateDateStorageKey, lastUpdateDate);

        setIsUpdating(false);
      }

      setLastUpdate(lastUpdateDate as string);

      const accountsPromiseResult = await Promise.all(
        itemsId.map((id) => pluggyService.fetchAccounts(id)),
      );

      const accountsList = accountsPromiseResult.reduce(
        (list, { results }) => [...list, ...results],
        [] as Account[],
      );

      setAccounts(accountsList);

      const investimentsPromiseResult = await Promise.all(
        itemsId.map((id) => pluggyService.fetchInvestments(id)),
      );

      const investmentsList = investimentsPromiseResult.reduce(
        (list, { results }) => [...list, ...results],
        [] as Investment[],
      );

      setInvestments(investmentsList);

      setIsLoading(false);
    },
    [pluggyService, updateItemAndWaitForFinish],
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
      {isUpdating && (
        <UpdatingToastContainer>
          <UpdatingToastActivityIndicator color="black" />
          <UpdatingToastContent>
            <UpdatingToastTitle>Sincronizando dados</UpdatingToastTitle>
            <UpdatingToastSubtitle>Isso poderá levar algum tempo...</UpdatingToastSubtitle>
          </UpdatingToastContent>
        </UpdatingToastContainer>
      )}
      <Content
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
                Balanço
              </Text>
              <HStack justifyContent="space-between">
                <Text>Saldo das contas</Text>
                <Text>R$ {formatMoney({ value: totalBalance, hidden: hideMoney })}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text>Fatura dos cartões</Text>
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
      </Content>
      <VersionTag>v1.0.5</VersionTag>
    </Container>
  );
};

export default Home;
