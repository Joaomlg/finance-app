import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect, useState } from 'react';
import { AuthButton, AuthButtonContainer, AuthButtonText, Container, SpashImage } from './styles';

export type AuthenticateProps = {
  children: React.ReactNode;
};

const AuthenticationProvider: React.FC<AuthenticateProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const authenticationRoutine = useCallback(async () => {
    const isAuthenticated = __DEV__ || (await authenticate());
    setAuthenticated(isAuthenticated);
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
    authenticationRoutine();
  }, [authenticationRoutine]);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButtonContainer>
        <AuthButton name="lock" onPress={authenticationRoutine}>
          <AuthButtonText>Usar senha do telefone</AuthButtonText>
        </AuthButton>
      </AuthButtonContainer>
    </Container>
  );
};

export default AuthenticationProvider;
