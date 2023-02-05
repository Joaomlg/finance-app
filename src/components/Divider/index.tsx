import React from 'react';
import { ViewProps } from 'react-native';
import { Container } from './styles';

const Divider: React.FC<ViewProps> = ({ ...props }) => {
  return <Container {...props} />;
};

export default Divider;
