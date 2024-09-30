import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import HorizontalBar from '../../components/HorizontalBar';
import { MonthData } from './types';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<MonthData>) => FlatList<MonthData>,
).attrs({
  contentContainerStyle: {
    padding: 24,
  },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

export const ItemContainer = styled.View`
  gap: 12px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MonthTrendContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TouchableIconContainer = styled.TouchableOpacity``;

export const HorizontalBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StyledHorizontalBar = styled(HorizontalBar)`
  margin-right: 12px;
`;

export const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;

export const StyledButton = styled(Button)`
  margin-top: 48px;
`;
