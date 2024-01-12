import styled from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import Header from '../../components/Header';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const BottomSheet = styled(FlexContainer).attrs({ gap: 24 })`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 24px;
  flex-grow: 1;
`;

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
