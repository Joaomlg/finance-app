import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';
import { Color } from '../../theme';

export type IconName = keyof typeof MaterialIcons.glyphMap;

export interface IconProps {
  name: IconName;
  size: number;
  color?: Color | string;
  onPress?: () => void;
  onLongPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ name, size, color, onPress, onLongPress }) => {
  const theme = useTheme();

  let iconColor: string;

  if (color) {
    if (color in theme.colors) {
      iconColor = theme.colors[color as Color];
    } else {
      iconColor = color;
    }
  } else {
    iconColor = theme.colors.text;
  }

  return onPress || onLongPress ? (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <MaterialIcons name={name} size={size} color={iconColor} />
    </TouchableOpacity>
  ) : (
    <MaterialIcons name={name} size={size} color={iconColor} />
  );
};

export default Icon;
