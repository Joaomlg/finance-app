import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import light from '../../theme/light';
import Text from '../Text';

import { Button, Container } from './styles';

type COLOR = keyof typeof light.colors;

export interface TextButtonProps extends TouchableOpacityProps {
  text: string;
  color?: COLOR;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconGap?: number;
  onPress?: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
  text,
  color,
  icon,
  iconGap,
  onPress,
  ...props
}) => {
  const theme = useTheme();

  const colorCode = theme.colors[color || 'text'];

  return (
    <Button {...props} onPress={onPress}>
      <Container gap={iconGap !== undefined ? iconGap : 4}>
        <Text variant="light-bold" color={color}>
          {text}
        </Text>
        {icon && <MaterialIcons name={icon} color={colorCode} size={14} />}
      </Container>
    </Button>
  );
};

export default TextButton;
