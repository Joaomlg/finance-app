import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useCallback, useContext, useState } from 'react';
import AuthContext from '../../contexts/AuthContext';

GoogleSignin.configure({
  webClientId: '953691595970-jgj8r4rf4fe09h0ajfah7ieebr38bbrf.apps.googleusercontent.com',
});

const GoogleSignInButton: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const [isAuthInProgress, setAuthInProgress] = useState(false);

  const { signInWithGoogle } = useContext(AuthContext);

  const onGoogleButtonPress = useCallback(async () => {
    setAuthInProgress(true);

    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Sign-in the user with the token
    await signInWithGoogle(idToken || '');

    if (onPress) onPress();

    setAuthInProgress(false);
  }, [onPress, signInWithGoogle]);

  return (
    <GoogleSigninButton
      style={{ width: 256, height: 56 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      disabled={isAuthInProgress}
      onPress={onGoogleButtonPress}
    />
  );
};

export default GoogleSignInButton;
