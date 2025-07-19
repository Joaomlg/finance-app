import styled from 'styled-components/native';
import RowContent from '../../../components/RowContent';

export const AnnualBalanceContainer = styled(RowContent)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 12px 0;
`;

export const AnnualBalanceContent = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const AnnualBalanceValueContainer = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;
