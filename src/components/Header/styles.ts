import styled from 'styled-components/native';
import FlexContainer from '../FlexContainer';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TitleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
`;

export const Actions = styled(FlexContainer).attrs({ direction: 'row', gap: 24 })`
  flex-grow: 1;
  justify-content: flex-end;
`;
