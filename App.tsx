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
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';
import Authenticate from './src/components/Authentication';
import { AppContextProvider } from './src/contexts/AppContext';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import light from './src/theme/light';

moment.locale('pt-BR');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const theme = light;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <HooksProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1 }}>
                <StatusBar style="light" backgroundColor={theme.colors.primary} />
                {isAuthenticated ? (
                  <Routes />
                ) : (
                  <Authenticate onAuthenticationChange={(value) => setAuthenticated(value)} />
                )}
              </SafeAreaView>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </HooksProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}
