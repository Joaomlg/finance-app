import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { CardContainer } from './styles';

const Card: React.FC<TouchableOpacityProps> = ({ children, onPress, ...viewProps }) => {
  return (
    <CardContainer disabled={onPress === undefined} onPress={onPress} {...viewProps}>
      {children}
    </CardContainer>
  );
};

export default Card;
