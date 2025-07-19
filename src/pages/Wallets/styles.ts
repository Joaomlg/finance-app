import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import Divider from '../../components/Divider';
import { Wallet } from '../../models';
import Text from '../../components/Text';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<Wallet>) => FlatList<Wallet>,
).attrs(() => ({
  contentContainerStyle: {
    padding: 24,
  },
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

export const HeaderText = styled(Text)`
  margin-bottom: 24px;
`;

export const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;
