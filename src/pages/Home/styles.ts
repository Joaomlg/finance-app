import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Content = styled.ScrollView`
  padding: 12px;
`;

export const VersionTag = styled.Text`
  position: absolute;
  bottom: 6px;
  right: 8px;
  color: #eee;
  font-weight: bold;
  font-size: 10px;
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
