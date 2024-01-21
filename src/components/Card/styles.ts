import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 24px;
  overflow: hidden;
`;
