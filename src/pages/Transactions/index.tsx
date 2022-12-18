import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { HStack, Text, FlatList, Box, VStack, Divider } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Account, Transaction } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import { Container } from './styles';

const Transactions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([] as Transaction[]);

  const pluggyService = usePluggyService();

  const previousDate = useRef(moment(0));

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);

    const itemsId: string[] = JSON.parse(
      (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
    );

    const accountPromiseResults = await Promise.all(
      itemsId.map((id) => pluggyService.fetchAccounts(id)),
    );

    const accounts = accountPromiseResults.reduce(
      (list, item) => [...list, ...item.results],
      [] as Account[],
    );

    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');

    const promiseResults = await Promise.all(
      accounts.map(({ id }) =>
        pluggyService.fetchTransactions(id, {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        }),
      ),
    );

    const transactionsList = promiseResults
      .reduce((list, item) => [...list, ...item.results], [] as Transaction[])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setTransactions(transactionsList);
    setIsLoading(false);
  }, [pluggyService]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const transactionsListSeparator = (transaction: Transaction) => {
    const date = moment(transaction.date).startOf('day');

    const component = date.isAfter(previousDate.current) ? (
      <HStack space={3} alignItems="center">
        <VStack justifyContent="center">
          <Text>{date.format('DD')}</Text>
          <Text>{date.format('MMM')}</Text>
        </VStack>
        <Divider />
      </HStack>
    ) : (
      <Divider />
    );

    previousDate.current = date;

    return component;
  };

  return (
    <Container>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTransactions} />}
        data={transactions}
        renderItem={({ item }) => (
          <HStack padding={3} justifyContent="space-between" alignItems="flex-end" space={3}>
            <VStack flexShrink={1}>
              <Text fontWeight="thin">{item.category}</Text>
              <Text isTruncated>{item.description}</Text>
            </VStack>
            <Text>R$ {item.amount.toFixed(2)}</Text>
          </HStack>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={({ leadingItem }) => transactionsListSeparator(leadingItem)}
      />
    </Container>
  );
};

export default Transactions;
