import 'styled-components';
import light from '../theme/light';

declare module 'styled-components' {
  type ThemeProvider = typeof light;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeProvider {}
}
