import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import 'moment/locale/pt';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, UIManager, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import SecurityGuard from './src/components/SecurityGuard';
import { AppContextProvider } from './src/contexts/AppContext';
import { AppContextProvider2 } from './src/contexts/AppContext2';
import { AuthContextProvider } from './src/contexts/AuthContext';
import { BottomSheetContextProvider } from './src/contexts/BottomSheetContext';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import dark from './src/theme/dark';
import light from './src/theme/light';

moment.locale('pt-BR');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? dark : light;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <SecurityGuard>
          <AppContextProvider>
            <AppContextProvider2>
              <HooksProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetContextProvider>
                    <SafeAreaView style={{ flex: 1 }}>
                      <StatusBar style="light" backgroundColor={theme.colors.primary} />
                      <Routes />
                      <Toast />
                    </SafeAreaView>
                  </BottomSheetContextProvider>
                </GestureHandlerRootView>
              </HooksProvider>
            </AppContextProvider2>
          </AppContextProvider>
        </SecurityGuard>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
