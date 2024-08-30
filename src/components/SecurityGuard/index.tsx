import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../../contexts/AuthContext';
import Text from '../Text';
import { AuthButton, AuthButtonContainer, Container, SpashImage } from './styles';

export type SecurityGuardProps = {
  children: React.ReactNode;
};

const SecurityGuard: React.FC<SecurityGuardProps> = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [isAuthenticated, setAuthenticated] = useState(__DEV__ || !user);

  const authenticationRoutine = useCallback(async () => {
    const result = await authenticate();
    setAuthenticated(result);
  }, []);

  const authenticate = async () => {
    const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!authTypes) {
      return true;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloqueie seu telefone',
      });

      return result.success;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      authenticationRoutine();
    }
  }, [authenticationRoutine, isAuthenticated]);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButtonContainer>
        <AuthButton onPress={authenticationRoutine}>
          <Text typography="title">Usar senha do telefone</Text>
        </AuthButton>
      </AuthButtonContainer>
    </Container>
  );
};

export default SecurityGuard;
