import styled from 'styled-components/native';
import FlexContainer from '../FlexContainer';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TitleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Actions = styled(FlexContainer).attrs({ direction: 'row', gap: 24 })`
  flex-grow: 1;
  justify-content: flex-end;
`;
