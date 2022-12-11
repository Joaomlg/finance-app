import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native'
import { AppContextProvider } from './src/contexts/appContext';
import Routes from "./src/routes";
import light from './src/theme/light';

export default function App() {
  return (
    <AppContextProvider>
      <ThemeProvider theme={light}>
        <StatusBar style="auto" />
        <Routes />
      </ThemeProvider>
    </AppContextProvider>
  );
}