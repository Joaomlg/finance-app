import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import light from '../../theme/light';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Button, Container } from './styles';

type Color = keyof typeof light.colors;

export interface TextButtonProps extends TouchableOpacityProps {
  text: string;
  color?: Color;
  icon?: IconName;
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
  return (
    <Button {...props} onPress={onPress}>
      <Container gap={iconGap !== undefined ? iconGap : 4}>
        <Text variant="light-bold" color={color}>
          {text}
        </Text>
        {icon && <Icon name={icon} color={color || 'text'} size={14} />}
      </Container>
    </Button>
  );
};

export default TextButton;
