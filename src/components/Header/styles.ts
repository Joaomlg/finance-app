import styled from 'styled-components/native';

export const Container = styled.View<{ canGoBack: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 24px;
  padding-left: ${(props) => (props.canGoBack ? '16px' : '24px')};
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
