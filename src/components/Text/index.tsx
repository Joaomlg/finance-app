import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from 'styled-components';
import { Color, Typography } from '../../theme';

export interface TextProps extends RNTextProps {
  typography?: Typography;
  color?: Color;
  transform?: TextStyle['textTransform'];
  strike?: boolean;
  ellipsize?: boolean;
}

const Text: React.FC<TextProps> = ({
  typography,
  color,
  style,
  transform,
  strike,
  ellipsize,
  ...rnProps
}) => {
  const theme = useTheme();

  return (
    <RNText
      style={[
        {
          textTransform: transform || 'none',
          color: theme.colors[color || 'text'],
          textDecorationLine: strike ? 'line-through' : 'none',
          flexShrink: ellipsize ? 1 : undefined,
          ...theme.typography[typography || 'default'],
        },
        style,
      ]}
      numberOfLines={ellipsize ? 1 : undefined}
      ellipsizeMode={ellipsize ? 'tail' : undefined}
      {...rnProps}
    />
  );
};

export default Text;
