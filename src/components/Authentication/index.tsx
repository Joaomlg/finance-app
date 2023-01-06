import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect } from 'react';
import { AuthButton, AuthButtonContainer, AuthButtonText, Container, SpashImage } from './styles';

export type AuthenticateProps = {
  onAuthenticationChange?: (result: boolean) => void;
};

const Authenticate: React.FC<AuthenticateProps> = ({ onAuthenticationChange }) => {
  const handleAuthenticationChange = useCallback(
    (value: boolean) => {
      if (onAuthenticationChange) {
        onAuthenticationChange(value);
      }
    },
    [onAuthenticationChange],
  );

  const authenticationRoutine = useCallback(async () => {
    // const isAuthenticated = __DEV__ || (await authenticate());
    const isAuthenticated = await authenticate();
    handleAuthenticationChange(isAuthenticated);
  }, [handleAuthenticationChange]);

  const authenticate = async () => {
    const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!authTypes) {
      return true;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloqueie seu celular',
      });

      return result.success;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    authenticationRoutine();
  }, [authenticationRoutine]);

  return (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButtonContainer>
        <AuthButton name="lock" onPress={authenticationRoutine}>
          <AuthButtonText>Usar senha do celular</AuthButtonText>
        </AuthButton>
      </AuthButtonContainer>
    </Container>
  );
};

export default Authenticate;
