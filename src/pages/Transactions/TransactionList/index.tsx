import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { Transaction } from '../../../models';

import {
  ListHeaderContainer,
  ListSeparatorContainer,
  ListSeparatorDate,
  ListSeparatorDivider,
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
        <Text typography="light" color="textLight">
          {transactions.length} transações
        </Text>
        <Money typography="heading" value={reducedValue} />
      </ListHeaderContainer>
    );
  }, [transactions, reducedValue]);

  const renderListItemSeparator = useCallback((transaction: Transaction, index: number) => {
    const date = moment(transaction.date).startOf('day');

    const component =
      index === 0 || date.isBefore(ItemDividerPreviousDateRef.current, 'day') ? (
        <ListSeparatorContainer>
          <ListSeparatorDate>
            <Text typography="title" color="textLight">
              {date.format('DD')}
            </Text>
            <Text typography="light" color="textLight">
              {date.format('MMM')}
            </Text>
          </ListSeparatorDate>
          <ListSeparatorDivider />
          <Text typography="defaultBold" color="textLight">
            {date.format('ddd')}
          </Text>
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
