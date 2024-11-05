import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { createContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
};

export type AuthContextValue = {
  user: User | undefined;
  authenticated: boolean;
  signInWithGoogle: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextValue);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User>();

  const signInWithGoogle = async (token: string) => {
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(token);

    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);
  };

  const signOut = async () => {
    await Promise.all([auth().signOut(), GoogleSignin.signOut()]);
  };

  useEffect(() => {
    // Handle user state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid, email } = user;

        setUser({
          id: uid,
          name: displayName,
          email,
          avatar: photoURL,
        });
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <AuthContext.Provider
      value={{ user, authenticated: user !== undefined, signInWithGoogle, signOut }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContext;
