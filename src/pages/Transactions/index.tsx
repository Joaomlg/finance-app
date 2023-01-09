import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import { Avatar, Divider, FlatList, HStack, Icon, Spacer, Text, VStack } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItemInfo, RefreshControl, TouchableOpacity } from 'react-native';
import MonthYearPicker from '../../components/MonthYearPicker';
import usePluggyService from '../../hooks/pluggyService';
import { Account, Transaction } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';
import { formatMoney } from '../../utils/money';

import { Container } from './styles';

const NUBANK_IGNORED_TRANSACTIONS = [
  'Pagamento da fatura',
  'Pagamento recebido',
  'Dinheiro guardado',
  'Dinheiro resgatado',
];

const now = moment();

const Transactions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [selectedMonth, setSelectedMonth] = useState(now);
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);

  const pluggyService = usePluggyService();

  const previousDate = useRef(moment(0));

  const totalIncomes = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) =>
          transaction.type === 'CREDIT' ? total + Math.abs(transaction.amount) : total,
        0,
      ),
    [transactions],
  );

  const totalExpenses = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) =>
          transaction.type === 'DEBIT' ? total + Math.abs(transaction.amount) : total,
        0,
      ),
    [transactions],
  );

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

    const startDate = moment(selectedMonth).startOf('month');
    const endDate = moment(selectedMonth).endOf('month');

    const promiseResults = await Promise.all(
      accounts.map(({ id }) =>
        pluggyService.fetchTransactions(id, {
          pageSize: 500,
          from: startDate.format('YYYY-MM-DD'),
          to: endDate.format('YYYY-MM-DD'),
        }),
      ),
    );

    const transactionsList = promiseResults
      .reduce((list, item) => [...list, ...item.results], [] as Transaction[])
      .filter((item) => !NUBANK_IGNORED_TRANSACTIONS.includes(item.description))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTransactions(transactionsList);
    setIsLoading(false);
  }, [pluggyService, selectedMonth]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const listHeaderComponent = useCallback(
    () => (
      <HStack space={3} marginY={3}>
        <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => setMonthYearPickerOpened(true)}>
          <HStack flex={1} space={1} alignItems="center">
            <Text fontSize="xl" textTransform="capitalize" fontWeight="bold">
              {selectedMonth.format('MMMM YYYY')}
            </Text>
            <Icon as={MaterialIcons} name="expand-more" size="xl" />
          </HStack>
        </TouchableOpacity>
        <VStack>
          <Text>Renda</Text>
          <Text>R$ {formatMoney({ value: totalIncomes })}</Text>
        </VStack>
        <VStack>
          <Text>Gasto</Text>
          <Text>R$ {formatMoney({ value: totalExpenses })}</Text>
        </VStack>
      </HStack>
    ),
    [selectedMonth, totalExpenses, totalIncomes],
  );

  const transactionsListSeparator = useCallback((transaction: Transaction, index: number) => {
    const date = moment(transaction.date).startOf('day');

    const component =
      index === 0 || date.isBefore(previousDate.current, 'day') ? (
        <HStack space={3} alignItems="center">
          <VStack alignItems="center">
            <Text fontWeight="bold" fontSize="xl" color="coolGray.400">
              {date.format('DD')}
            </Text>
            <Text textTransform="uppercase" fontWeight="light" color="coolGray.400">
              {date.format('MMM')}
            </Text>
          </VStack>
          <Divider />
        </HStack>
      ) : (
        <></>
      );

    previousDate.current = date;

    return component;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Transaction>) => (
      <>
        {transactionsListSeparator(item, index)}
        <HStack paddingY={3} alignItems="center" space={3}>
          <Avatar
            backgroundColor="transparent"
            borderStyle="solid"
            borderColor="coolGray.500"
            borderWidth="1"
          >
            <Icon
              as={MaterialIcons}
              name={item.type == 'DEBIT' ? 'shopping-cart' : 'attach-money'}
              size="md"
            />
          </Avatar>
          <VStack flexShrink={1}>
            {item.category && <Text fontWeight="thin">{item.category}</Text>}
            <Text isTruncated>{item.description}</Text>
          </VStack>
          <Spacer />
          <Text fontWeight="bold">
            {item.type === 'DEBIT' ? '-' : ''}R${' '}
            {formatMoney({ value: item.amount, absolute: true })}
          </Text>
        </HStack>
      </>
    ),
    [transactionsListSeparator],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const handleMonthYearPickerChange = (value: Moment) => {
    setSelectedMonth(value);
    setMonthYearPickerOpened(false);
  };

  return (
    <Container>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTransactions} />}
        ListHeaderComponent={listHeaderComponent}
        data={transactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        paddingX={3}
      />
      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
    </Container>
  );
};

export default Transactions;
