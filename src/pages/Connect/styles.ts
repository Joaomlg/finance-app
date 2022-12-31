import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-content: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding-top: 12px;
`;
