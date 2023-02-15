import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import FlexContainer from '../../../components/FlexContainer';
import TransactionListItem from '../../../components/TransactionListItem';
import { Transaction } from '../../../services/pluggy';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<Transaction>) => FlatList<Transaction>,
).attrs(() => ({
  contentContainerStyle: {
    padding: 24,
  },
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;

export const ListHeaderContainer = styled(FlexContainer).attrs({ gap: 4 })`
  margin-bottom: 12px;
`;

export const ListSeparatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 0;
`;

export const ListSeparatorDate = styled.View`
  align-items: center;
  margin-right: 12px;
`;

export const StyledTransactionListItem = styled(TransactionListItem)`
  padding: 12px 0;
`;
