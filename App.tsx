import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import 'moment/locale/pt';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import light from './src/theme/light';

moment.locale('pt-BR');

export default function App() {
  return (
    <NativeBaseProvider>
      <HooksProvider>
        <ThemeProvider theme={light}>
          <StatusBar style="auto" />
          <Routes />
        </ThemeProvider>
      </HooksProvider>
    </NativeBaseProvider>
  );
}
