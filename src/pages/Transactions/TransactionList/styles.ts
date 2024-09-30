import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import TransactionListItem from '../../../components/TransactionListItem';
import { Transaction } from '../../../models';
import Divider from '../../../components/Divider';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<Transaction>) => FlatList<Transaction>,
).attrs(() => ({
  contentContainerStyle: {
    padding: 24,
    paddingBottom: 100,
  },
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

export const ListHeaderContainer = styled.View`
  margin-bottom: 12px;
  gap: 4px;
`;

export const ListSeparatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 0;
  gap: 12px;
`;

export const ListSeparatorDate = styled.View`
  align-items: center;
`;

export const ListSeparatorDivider = styled(Divider)`
  flex: 1;
`;

export const StyledTransactionListItem = styled(TransactionListItem)`
  padding: 12px 0;
`;
