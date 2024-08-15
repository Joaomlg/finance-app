import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from 'styled-components';
import { Color, Typography } from '../../theme';

export interface TextProps extends RNTextProps {
  typography?: Typography;
  color?: Color;
  transform?: TextStyle['textTransform'];
}

const Text: React.FC<TextProps> = ({ typography, color, style, transform, ...rnProps }) => {
  const theme = useTheme();

  return (
    <RNText
      style={[
        {
          textTransform: transform || 'none',
          color: theme.colors[color || 'text'],
          ...theme.typography[typography || 'default'],
        },
        style,
      ]}
      {...rnProps}
    />
  );
};

export default Text;
