import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import { MonthBalance } from '.';
import Divider from '../../components/Divider';
import FlexContainer from '../../components/FlexContainer';
import Header from '../../components/Header';
import HorizontalBar from '../../components/HorizontalBar';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const StyledFlatList = styled(
  FlatList as new (props: FlatListProps<MonthBalance>) => FlatList<MonthBalance>,
).attrs({
  contentContainerStyle: {
    padding: 24,
  },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;

export const MonthTrendContainer = styled(FlexContainer).attrs({ direction: 'row', gap: 8 })`
  align-items: center;
`;

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

export const Button = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 100px;
  margin-top: 48px;
`;
