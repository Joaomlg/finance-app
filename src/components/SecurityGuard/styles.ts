import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const SpashImage = styled.Image`
  height: 100%;
  width: 100%;
`;

export const AuthButtonContainer = styled.View`
  position: absolute;
  bottom: 50px;
  align-self: center;
  border-radius: 48px;
`;

export const AuthButton = styled.TouchableOpacity.attrs({ activeOpacity: 0.9 })`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 24px;
  border-radius: 48px;
`;
