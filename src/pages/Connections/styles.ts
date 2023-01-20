import { SvgUri } from 'react-native-svg';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding: 24px 12px;
`;

export const ListItem = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #e5e7eb; // coolGray.200
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

export const ListItemAvatar = styled.View<{ color: string }>`
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => props.color};
  border-radius: 100px;
  margin-right: 12px;
  height: 48px;
  width: 48px;
`;

export const ItemContent = styled.View`
  flex: 1;
`;

export const CreatedAtText = styled.Text`
  font-weight: 100;
`;

export const StatusChip = styled.Text<{ backgroundColor: string; color: string }>`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
`;

export const FabButton = styled.TouchableOpacity`
  background-color: gray;
  padding: 16px;
  position: absolute;
  right: 16px;
  bottom: 16px;
  flex-direction: row;
  align-items: center;
  border-radius: 100px;
`;

export const FabText = styled.Text`
  color: white;
  margin-left: 8px;
  font-size: 16px;
`;
