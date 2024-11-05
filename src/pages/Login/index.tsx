import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AuthContext from '../../contexts/AuthContext';
import { AuthButtonContainer, Container, SpashImage } from './styles';
import Toast from 'react-native-toast-message';

const Login: React.FC = () => {
  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleGoogleSignInPress = () => {
    navigation.navigate('home');
  };

  const handleGoogleSignInError = () => {
    Toast.show({
      type: 'error',
      text1: 'Erro ao fazer login com o Google.',
    });
  };

  useEffect(() => {
    if (user) {
      navigation.dispatch(StackActions.replace('home'));
    }
  }, [navigation, user]);

  return (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButtonContainer>
        <GoogleSignInButton onPress={handleGoogleSignInPress} onError={handleGoogleSignInError} />
      </AuthButtonContainer>
    </Container>
  );
};

export default Login;
