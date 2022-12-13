import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Item = styled.TouchableOpacity`
  padding: 12px 24px;
  border-bottom: 1px solid black;
  flex-direction: row;
  align-items: center;
`;

export const ItemSeparator = styled.View`
  height: 1px;
  background-color: grey;
  opacity: 0.5;
  margin: 0 12px;
`;

export const Title = styled.Text``;
