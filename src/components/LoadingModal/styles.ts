import styled from 'styled-components/native';
import Text from '../Text';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled(Text)`
  position: absolute;
  bottom: 64px;
`;
