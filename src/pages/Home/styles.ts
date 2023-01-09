import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
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
