import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding: 24px;
`;

export const Title = styled.Text`
  margin-bottom: 24px;
  font-size: 24px;
`;

export const Input = styled.TextInput`
  height: 40px;
  border: 1px solid black;
  border-radius: 4px;
  margin-bottom: 24px;
  padding-left: 12px;
`;
