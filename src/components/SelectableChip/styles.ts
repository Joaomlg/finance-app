import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity<{ selected?: boolean }>`
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid
    ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.lightGray)};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
`;
