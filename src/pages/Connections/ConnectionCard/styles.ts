import styled from 'styled-components/native';

export const CardErrorContainer = styled.View<{ radius?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ radius }) => (radius ? '8px' : '0')};
`;

export const CardErrorMessage = styled.View`
  margin-left: 8px;
`;

export const CardContainer = styled.View`
  padding: 16px;
  gap: 16px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CardHeaderContent = styled.View`
  flex-grow: 1;
`;

export const CardContent = styled.View`
  gap: 16px;
`;

export const AccountLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
