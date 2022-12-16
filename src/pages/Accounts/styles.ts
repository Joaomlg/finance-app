import { SvgUri } from 'react-native-svg';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding: 24px 12px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ItemCard = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 24px;
`;

export const ItemAvatar = styled(SvgUri)`
  margin-right: 12px;
`;

export const ItemInfo = styled.View``;

export const ItemAction = styled.View``;
