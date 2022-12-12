import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  padding: 24px 12px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const UpdatedAt = styled.Text`
  padding: 12px 0;
`;

export const AccountSection = styled.View``;

export const AccountInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ManageAccountButtonContainer = styled.View`
  padding: 12px 0;
`;
