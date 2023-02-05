import React from 'react';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

import { Container } from './styles';

const ScreenContainer: React.FC<SafeAreaViewProps> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default ScreenContainer;
