import styled from 'styled-components/native';
import FlexContainer from '../FlexContainer';

export const Button = styled.TouchableOpacity`
  align-self: flex-start;
`;

export const Container = styled(FlexContainer).attrs({ direction: 'row' })`
  align-items: center;
`;
