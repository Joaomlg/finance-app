import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useCallback, useContext, useState } from 'react';
import { GOOGLE_SERVICE_CLIENT_ID } from 'react-native-dotenv';
import AuthContext from '../../contexts/AuthContext';

GoogleSignin.configure({
  webClientId: GOOGLE_SERVICE_CLIENT_ID,
});

const GoogleSignInButton: React.FC<{ onPress?: () => void; onError?: () => void }> = ({
  onPress,
  onError,
}) => {
  const [isAuthInProgress, setAuthInProgress] = useState(false);

  const { signInWithGoogle } = useContext(AuthContext);

  const onGoogleButtonPress = useCallback(async () => {
    setAuthInProgress(true);

    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Sign-in the user with the token
      await signInWithGoogle(idToken || '');

      if (onPress) onPress();
    } catch (error) {
      if (onError) onError();
    }

    setAuthInProgress(false);
  }, [onError, onPress, signInWithGoogle]);

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
