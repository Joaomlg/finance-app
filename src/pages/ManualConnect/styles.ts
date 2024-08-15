import styled from 'styled-components/native';

export const TextInput = styled.TextInput.attrs(({ theme }) => ({
  selectionColor: theme.colors.primary,
  placeholderTextColor: theme.colors.textLight,
}))`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 24px;
  height: 64px;
  padding-left: 24px;
  font-size: ${({ theme }) => theme.text.title + 'px'};
  color: ${({ theme }) => theme.colors.text};
`;
