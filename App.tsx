import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import light from './src/theme/light';
import { NativeBaseProvider } from 'native-base';

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
