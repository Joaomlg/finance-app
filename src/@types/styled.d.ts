import 'styled-components';
import light from '../theme/light';

declare module 'styled-components' {
  type ThemeProvider = typeof light;

  export interface DefaultTheme extends ThemeProvider { }
}