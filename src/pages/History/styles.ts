import { FlatList, FlatListProps, SectionList, SectionListProps } from 'react-native';
import styled from 'styled-components/native';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import HorizontalBar from '../../components/HorizontalBar';
import { MonthlyBalance } from '../../contexts/AppContext';
import { AnnualBalance } from './types';
import RowContent from '../../components/RowContent';

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<MonthlyBalance>) => FlatList<MonthlyBalance>,
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

export const StyledSectionList = styled(
  SectionList as new (props: SectionListProps<MonthlyBalance, AnnualBalance>) => SectionList<
    MonthlyBalance,
    AnnualBalance
  >,
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

export const AnnualBalanceRow = styled(RowContent)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 12px 0;
`;

export const AnnualBalanceContent = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const AnnualBalanceItem = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
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
