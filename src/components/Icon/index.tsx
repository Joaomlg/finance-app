import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';
import light from '../../theme/light';

type Color = keyof typeof light.colors;

export type IconName = keyof typeof MaterialIcons.glyphMap;

export interface IconProps {
  name: IconName;
  size: number;
  color?: Color;
  onPress?: () => void;
  onLongPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ name, size, color, onPress, onLongPress }) => {
  const theme = useTheme();

  const iconColor = color ? theme.colors[color] : theme.colors.text;

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <MaterialIcons name={name} size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

export default Icon;
