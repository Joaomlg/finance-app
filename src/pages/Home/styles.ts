import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.boldbackgroundWhite};
`;

export const ScrollView = styled.ScrollView`
  padding: 12px;
`;

export const UpdatingToastContainer = styled.View`
  padding: 6px 12px;
  background-color: #eee;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const UpdatingToastActivityIndicator = styled.ActivityIndicator`
  margin-right: 12px;
`;

export const UpdatingToastContent = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const UpdatingToastTitle = styled.Text`
  font-weight: bold;
`;

export const UpdatingToastSubtitle = styled.Text`
  font-weight: 100;
`;

export const LastUpdatedAtBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const LastUpdatedAtText = styled.Text`
  font-weight: 100;
  font-size: 12px;
`;

export const BalanceCard = styled.View`
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

export const BalanceTitle = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
`;

export const BalanceRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #e5e7eb;
  margin-bottom: 8px;
`;

export const BalanceTotal = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TotalText = styled.Text`
  font-weight: bold;
`;

export const VersionTag = styled.Text`
  position: absolute;
  bottom: 6px;
  right: 8px;
  color: #eee;
  font-weight: bold;
  font-size: 10px;
`;
