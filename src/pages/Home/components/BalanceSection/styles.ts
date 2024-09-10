import styled from 'styled-components/native';
import TextButton from '../../../../components/TextButton';

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
