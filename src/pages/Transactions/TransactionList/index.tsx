import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import Divider from '../../../components/Divider';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { Transaction } from '../../../services/pluggy';
import {
  ListHeaderContainer,
  ListSeparatorContainer,
  ListSeparatorDate,
  StyledFlatList,
  StyledTransactionListItem,
} from './styles';

export interface TransactionListProps {
  transactions: Transaction[];
  reducedValue: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  reducedValue,
  isLoading,
  onRefresh,
}) => {
  const theme = useTheme();

  const ItemDividerPreviousDateRef = useRef(moment(0));

  const renderHeaderComponent = useCallback(() => {
    return (
      <ListHeaderContainer>
        <Text variant="light" color="textLight">
          {transactions.length} transações
        </Text>
        <Money variant="heading" value={reducedValue} />
      </ListHeaderContainer>
    );
  }, [transactions, reducedValue]);

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
    <StyledFlatList
      refreshControl={
        <RefreshControl
          refreshing={isLoading || false}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeaderComponent}
    />
  );
};

export default React.memo(TransactionList);
