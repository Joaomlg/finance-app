import React from 'react';
import { ViewProps } from 'react-native';
import Text from '../Text';
import { Container } from './styles';
import { Color } from '../../theme';
import { useTheme } from 'styled-components';

export interface ChipProps extends ViewProps {
  text?: string;
  color?: Color;
  textColor?: Color;
}

const Chip: React.FC<ChipProps> = ({ text, color, textColor }) => {
  const theme = useTheme();

  const parsedColor = theme.colors[color as Color];

  return (
    <Container color={parsedColor}>
      <Text typography="defaultBold" color={textColor}>
        {text}
      </Text>
    </Container>
  );
};

export default Chip;
