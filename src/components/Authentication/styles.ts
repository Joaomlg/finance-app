import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const SpashImage = styled.Image`
  height: 100%;
  width: 100%;
`;

export const AuthButtonContainer = styled.View`
  position: absolute;
  bottom: 100px;
  align-self: center;
`;

export const AuthButton = styled(MaterialIcons.Button)`
  padding: 12px;
`;

export const AuthButtonText = styled.Text`
  font-weight: bold;
  color: white;
`;
