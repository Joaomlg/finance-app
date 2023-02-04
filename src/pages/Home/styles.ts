import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TopContainer = styled(FlexContainer).attrs({ gap: 12 })`
  padding: 24px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
`;

export const BottomSheet = styled(FlexContainer).attrs({ gap: 24 })`
  background-color: ${({ theme }) => theme.colors.boldbackgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  flex-grow: 1;
`;

export const MonthButton = styled.TouchableOpacity`
  flex-direction: row;
`;

export const HeaderActions = styled(FlexContainer).attrs({ direction: 'row', gap: 12 })``;

export const BalanceLine = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 12px;
`;

export const BalanceFillLine = styled.View`
  flex-grow: 1;
  height: 0.5px;
  background-color: ${({ theme }) => theme.colors.textWhite};
  opacity: 0.3;
  margin: 0 4px;
`;

export const ConnectionsButton = styled.TouchableOpacity`
  padding: 8px 0;
  align-self: flex-start;
`;

export const ConnectionButtonContainer = styled(FlexContainer).attrs({ direction: 'row', gap: 4 })`
  align-items: center;
`;

export const HorizontalBarContainer = styled(FlexContainer).attrs({ direction: 'row', gap: 16 })`
  align-items: center;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const TransactionsListHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SeeMoreTransactionsButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
