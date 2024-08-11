import styled from 'styled-components/native';
import Header from '../../components/Header';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const UserContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 24px;
`;

export const Avatar = styled.Image`
  height: 48px;
  width: 48px;
  border-radius: 48px;
`;

export const UserInfo = styled.View`
  flex: 1;
`;
