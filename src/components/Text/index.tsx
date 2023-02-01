import React from 'react';
import { TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from 'styled-components';
import light from '../../theme/light';
import { Default, DefaultBold, ExtraLight, Heading, Light, LightBold, Title } from './styles';

const TextVariants = [
  'default',
  'default-bold',
  'heading',
  'title',
  'light',
  'light-bold',
  'extra-light',
] as const;

type Variant = typeof TextVariants[number];

type COLOR = keyof typeof light.COLORS;

export interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: COLOR;
  transform?: TextStyle['textTransform'];
}

const Text: React.FC<TextProps> = ({ variant, color, style, transform, ...rnProps }) => {
  const theme = useTheme();

  const appendStyle = transform ? { textTransform: transform } : {};
  const props = { color: theme.COLORS[color || 'TEXT'], style: [style, appendStyle], ...rnProps };

  switch (variant) {
    case 'default-bold':
      return <DefaultBold {...props} />;
    case 'heading':
      return <Heading {...props} />;
    case 'title':
      return <Title {...props} />;
    case 'light':
      return <Light {...props} />;
    case 'light-bold':
      return <LightBold {...props} />;
    case 'extra-light':
      return <ExtraLight {...props} />;
    default:
      return <Default {...props} />;
  }
};

export default Text;
