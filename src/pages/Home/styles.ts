import styled from 'styled-components/native';
import TextButton from '../../components/TextButton';

export const TopContainer = styled.View`
  padding: 24px;
  gap: 12px;
`;

export const BottomSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  flex-grow: 1;
  gap: 24px;
`;

export const BottomSheetContent = styled.View`
  gap: 16px;
`;

export const BalanceContainer = styled.View`
  margin-top: 8px;
  gap: 12px;
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

export const SubSectionContainer = styled.View`
  gap: 12px;
`;

export const HorizontalBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
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

export const BalanceWithTreding = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
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

export const TransactionListContainer = styled.View`
  flex: 1;
  gap: 24px;
`;
