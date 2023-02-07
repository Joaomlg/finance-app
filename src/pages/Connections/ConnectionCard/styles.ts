import styled from 'styled-components/native';
import FlexContainer from '../../../components/FlexContainer';

export const Card = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 24px;
  overflow: hidden;
`;

export const CardErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.error};
`;

export const CardErrorMessage = styled.View`
  margin-left: 8px;
`;

export const CardContent = styled(FlexContainer).attrs({ gap: 16 })`
  padding: 16px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ListItemAvatar = styled.View<{ color: string }>`
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => props.color};
  border-radius: 100px;
  margin-right: 12px;
  height: 32px;
  width: 32px;
`;

export const CardHeaderContent = styled.View`
  flex-grow: 1;
`;

export const AccountLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
