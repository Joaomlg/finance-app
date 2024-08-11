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
  font-size: ${({ theme }) => theme.text.title};
  color: ${({ theme }) => theme.colors.text};
`;

export const Button = styled.TouchableOpacity.attrs({ activeOpacity: 0.9 })`
  width: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 24px;
  border-radius: 48px;
`;
