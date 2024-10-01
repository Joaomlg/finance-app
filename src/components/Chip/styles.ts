import styled from 'styled-components/native';

export const Container = styled.View<{ color?: string }>`
  background-color: ${({ color }) => color};
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 100px;
`;
