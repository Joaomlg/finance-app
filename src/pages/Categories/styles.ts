import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import { Category } from '../../models';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<Category>) => FlatList<Category>,
).attrs(() => ({
  contentContainerStyle: {
    padding: 24,
    gap: 24,
  },
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;
