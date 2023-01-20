import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import 'moment/locale/pt';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components/native';
import Authenticate from './src/components/Authentication';
import HooksProvider from './src/hooks';
import Routes from './src/routes';
import light from './src/theme/light';

moment.locale('pt-BR');

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <HooksProvider>
      <ThemeProvider theme={light}>
        <StatusBar style="auto" />
        {isAuthenticated ? (
          <Routes />
        ) : (
          <Authenticate onAuthenticationChange={(value) => setAuthenticated(value)} />
        )}
      </ThemeProvider>
    </HooksProvider>
  );
}
