import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AuthContext from '../../contexts/AuthContext';
import { AuthButtonContainer, Container, SpashImage } from './styles';

const Login: React.FC = () => {
  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleGoogleSignInPress = () => {
    navigation.navigate('home');
  };

  useEffect(() => {
    if (user) {
      navigation.navigate('home');
    }
  }, [navigation, user]);

  return (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButtonContainer>
        <GoogleSignInButton onPress={handleGoogleSignInPress} />
      </AuthButtonContainer>
    </Container>
  );
};

export default Login;
