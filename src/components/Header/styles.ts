import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TitleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
`;

export const Actions = styled.View`
  flex-direction: row;
  gap: 24px;
  flex-grow: 1;
  justify-content: flex-end;
`;
