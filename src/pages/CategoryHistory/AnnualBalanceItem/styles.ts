import styled from 'styled-components/native';
import RowContent from '../../../components/RowContent';

export const AnnualBalanceContainer = styled(RowContent)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 12px 0;
`;

export const AnnualBalanceContent = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const ColorDot = styled.View<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ color }) => color};
`;
