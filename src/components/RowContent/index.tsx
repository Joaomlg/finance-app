import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Container, Content } from './styles';

export interface RowContentProps extends TouchableOpacityProps {
  text?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

const RowContent: React.FC<RowContentProps> = ({
  text,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      {leftIcon && <Icon name={leftIcon} size={24} />}
      <Content>
        {text && <Text>{text}</Text>}
        {children}
      </Content>
      {rightIcon && <Icon name={rightIcon} size={24} />}
    </Container>
  );
};

export default RowContent;
