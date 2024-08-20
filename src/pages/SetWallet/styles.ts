import styled from 'styled-components/native';

export const HeaderExtensionContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 12px 24px;
`;

export const BalanceValueContainer = styled.View`
  flex: 1;
`;
