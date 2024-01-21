import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';
import { ButtonContainer } from './style';

const ButtonVariants = ['primary', 'secondary'] as const;

type Variant = typeof ButtonVariants[number];

export interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
}

const Button: React.FC<ButtonProps> = ({ children, variant, ...viewProps }) => {
  const theme = useTheme();

  const buttonColor = variant === 'secondary' ? theme.colors.lightGray : theme.colors.primary;

  return (
    <ButtonContainer color={buttonColor} activeOpacity={0.8} {...viewProps}>
      {children}
    </ButtonContainer>
  );
};

export default Button;
