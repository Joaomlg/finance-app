import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, Text } from 'react-native';
import MonthYearPicker from '../../components/MonthYearPicker';
import usePluggyService from '../../hooks/pluggyService';
import { Account, Transaction } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';
import { formatMoney } from '../../utils/money';

import {
  Container,
  Divider,
  ListHeader,
  ListItem,
  ListItemAmount,
  ListItemAmountValue,
  ListItemAvatar,
  ListItemCategory,
  ListItemContent,
  ListItemLabel,
  ListSeparatorContainer,
  ListSeparatorDate,
  ListSeparatorDateDay,
  ListSeparatorDateMonth,
  MonthSelectorButton,
  MonthSelectorButtonText,
  MonthSelectorContainer,
  TotalInfo,
} from './styles';

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
      <ListHeader>
        <MonthSelectorContainer>
          <MonthSelectorButton onPress={() => setMonthYearPickerOpened(true)}>
            <MonthSelectorButtonText>{selectedMonth.format('MMMM YYYY')}</MonthSelectorButtonText>
            <MaterialIcons name="expand-more" size={32} color="gray" />
          </MonthSelectorButton>
        </MonthSelectorContainer>
        <TotalInfo>
          <Text>Renda</Text>
          <Text>R$ {formatMoney({ value: totalIncomes })}</Text>
        </TotalInfo>
        <TotalInfo>
          <Text>Gasto</Text>
          <Text>R$ {formatMoney({ value: totalExpenses })}</Text>
        </TotalInfo>
      </ListHeader>
    ),
    [selectedMonth, totalExpenses, totalIncomes],
  );

  const renderListItemSeparator = useCallback((transaction: Transaction, index: number) => {
    const date = moment(transaction.date).startOf('day');

    const component =
      index === 0 || date.isBefore(previousDate.current, 'day') ? (
        <ListSeparatorContainer>
          <ListSeparatorDate>
            <ListSeparatorDateDay>{date.format('DD')}</ListSeparatorDateDay>
            <ListSeparatorDateMonth>{date.format('MMM')}</ListSeparatorDateMonth>
          </ListSeparatorDate>
          <Divider />
        </ListSeparatorContainer>
      ) : (
        <></>
      );

    previousDate.current = date;

    return component;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Transaction>) => (
      <>
        {renderListItemSeparator(item, index)}
        <ListItem>
          <ListItemAvatar>
            <MaterialIcons
              name={item.type == 'DEBIT' ? 'shopping-cart' : 'attach-money'}
              size={24}
              color="gray"
            />
          </ListItemAvatar>
          <ListItemContent>
            {item.category && <ListItemCategory>{item.category}</ListItemCategory>}
            <ListItemLabel numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </ListItemLabel>
          </ListItemContent>
          <ListItemAmount>
            <ListItemAmountValue>
              {item.type === 'DEBIT' ? '-' : ''}R${' '}
              {formatMoney({ value: item.amount, absolute: true })}
            </ListItemAmountValue>
          </ListItemAmount>
        </ListItem>
      </>
    ),
    [renderListItemSeparator],
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
        style={{ paddingHorizontal: 12 }}
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
