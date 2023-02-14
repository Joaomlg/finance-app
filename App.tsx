import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import 'moment/locale/pt';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import AuthenticationProvider from './src/components/Authentication';
import { AppContextProvider } from './src/contexts/AppContext';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import light from './src/theme/light';

moment.locale('pt-BR');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const theme = light;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthenticationProvider>
        <AppContextProvider>
          <HooksProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <StatusBar style="light" backgroundColor={theme.colors.primary} />
                  <Routes />
                  <Toast />
                </SafeAreaView>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </HooksProvider>
        </AppContextProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
}
