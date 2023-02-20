import styled from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import TextButton from '../../components/TextButton';

export const TopContainer = styled(FlexContainer).attrs({ gap: 12 })`
  padding: 24px;
`;

export const BottomSheet = styled(FlexContainer).attrs({ gap: 24 })`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  flex-grow: 1;
`;

export const BalanceContainer = styled(FlexContainer).attrs({ gap: 12 })`
  margin-top: 8px;
`;

export const BalanceLine = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

export const BalanceFillLine = styled.View`
  flex-grow: 1;
  height: 0.5px;
  background-color: ${({ theme }) => theme.colors.textWhite};
  opacity: 0.3;
  margin: 0 4px;
`;

export const ConnectionsButton = styled(TextButton)`
  padding: 8px 0;
`;

export const HorizontalBarContainer = styled(FlexContainer).attrs({ direction: 'row', gap: 16 })`
  align-items: center;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BalanceWithTreding = styled(FlexContainer).attrs({ direction: 'row', gap: 4 })`
  align-items: center;
`;

export const SeeMoreButton = styled(TextButton).attrs({
  color: 'textLight',
  icon: 'navigate-next',
  iconGap: 0,
})`
  height: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const TransactionListContainer = styled(FlexContainer).attrs({ gap: 24 })`
  flex: 1;
`;
