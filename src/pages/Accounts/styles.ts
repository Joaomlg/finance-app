import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding: 24px 12px;
`;

export const ItemCard = styled.TouchableOpacity`
  border: 1px solid black;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 24px;
`;
