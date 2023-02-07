import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import FlexContainer from '../../../components/FlexContainer';

export const Container = styled(FlexContainer).attrs({ gap: 24 })`
  flex: 1;
  padding: 24px;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const MenuIcon = styled(MaterialIcons).attrs(({ theme }) => ({
  size: 28,
  color: theme.colors.text,
}))`
  margin-right: 24px;
`;
