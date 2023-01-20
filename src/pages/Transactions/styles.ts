import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const ListHeader = styled.View`
  flex-direction: row;
  margin: 12px 0;
`;

export const MonthSelectorContainer = styled.View`
  flex-grow: 1;
`;

export const MonthSelectorButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const MonthSelectorButtonText = styled.Text`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 18px;
  color: gray;
`;

export const TotalInfo = styled.View`
  margin-left: 12px;
`;

export const ListSeparatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ListSeparatorDate = styled.View`
  align-items: center;
  margin-right: 12px;
`;

export const ListSeparatorDateDay = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: #9ca3af; // coolGray.400
`;

export const ListSeparatorDateMonth = styled.Text`
  font-weight: 100;
  text-transform: uppercase;
  color: #9ca3af; // coolGray.400
`;

export const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #e5e7eb; // coolGray.200
  margin-bottom: 8px;
`;

export const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

export const ListItemAvatar = styled.View`
  border-style: solid;
  border-width: 1px;
  border-color: gray;
  border-radius: 100px;
  padding: 8px;
  margin-right: 12px;
`;

export const ListItemContent = styled.View`
  flex-shrink: 1;
  margin-right: 12px;
`;

export const ListItemCategory = styled.Text`
  font-weight: 100;
  font-size: 10px;
  text-transform: uppercase;
`;

export const ListItemLabel = styled.Text``;

export const ListItemAmount = styled.View`
  flex-grow: 1;
  align-items: flex-end;
`;

export const ListItemAmountValue = styled.Text`
  font-weight: bold;
`;
