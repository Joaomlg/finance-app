import moment from 'moment';
import React, { useCallback, useContext, useRef } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Transaction } from '../../services/pluggy';
import {
  ListHeaderContainer,
  ListSeparatorContainer,
  ListSeparatorDate,
  StyledHeader,
  StyledTransactionListItem,
  TransactionList,
} from './styles';

const Transactions: React.FC = () => {
  const {
    isLoading,
    hideValues,
    setHideValues,
    transactions,
    fetchTransactions,
    date,
    totalIncomes,
    totalExpenses,
  } = useContext(AppContext);

  const theme = useTheme();

  const ItemDividerPreviousDateRef = useRef(moment(0));

  const renderHeaderComponent = useCallback(() => {
    return (
      <ListHeaderContainer>
        <Text variant="light" color="textLight">
          {transactions.length} transações
        </Text>
        <Money variant="heading" value={totalIncomes - totalExpenses} />
      </ListHeaderContainer>
    );
  }, [transactions, totalIncomes, totalExpenses]);

  const renderListItemSeparator = useCallback((transaction: Transaction, index: number) => {
    const date = moment(transaction.date).startOf('day');

    const component =
      index === 0 || date.isBefore(ItemDividerPreviousDateRef.current, 'day') ? (
        <ListSeparatorContainer>
          <ListSeparatorDate>
            <Text variant="title" color="textLight">
              {date.format('DD')}
            </Text>
            <Text variant="light" color="textLight">
              {date.format('MMM')}
            </Text>
          </ListSeparatorDate>
          <Divider />
        </ListSeparatorContainer>
      ) : (
        <></>
      );

    ItemDividerPreviousDateRef.current = date;

    return component;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Transaction>) => {
      return (
        <>
          {renderListItemSeparator(item, index)}
          <StyledTransactionListItem key={index} item={item} />
        </>
      );
    },
    [renderListItemSeparator],
  );

  return (
    <ScreenContainer>
      <StyledHeader
        title={date.format('MMMM')}
        actions={[
          {
            icon: hideValues ? 'visibility-off' : 'visibility',
            onPress: () => setHideValues(!hideValues),
          },
        ]}
      />
      <TransactionList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchTransactions}
            colors={[theme.colors.primary]}
          />
        }
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeaderComponent}
      />
    </ScreenContainer>
  );
};

export default Transactions;
