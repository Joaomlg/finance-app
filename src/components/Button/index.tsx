import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';
import { ButtonContainer } from './style';

const ButtonVariants = ['primary', 'secondary'] as const;

type Variant = typeof ButtonVariants[number];

export interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant, isLoading, ...viewProps }) => {
  const theme = useTheme();

  const buttonColor = variant === 'secondary' ? theme.colors.lightGray : theme.colors.primary;

  return (
    <ButtonContainer color={buttonColor} activeOpacity={0.8} {...viewProps}>
      {isLoading ? <ActivityIndicator size={24} color={theme.colors.textWhite} /> : children}
    </ButtonContainer>
  );
};

export default Button;
