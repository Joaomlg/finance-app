import styled from 'styled-components/native';

export const Container = styled.View<{ rounded?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ rounded }) => (rounded ? '8px' : '0')};
`;

export const Content = styled.View`
  margin-left: 8px;
`;
