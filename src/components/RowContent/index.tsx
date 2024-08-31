import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Container, Content } from './styles';

export interface RowContentProps extends TouchableOpacityProps {
  text?: string;
  leftIcon?: IconName;
  renderLeftIcon?: () => React.ReactNode;
  rightIcon?: IconName;
}

const RowContent: React.FC<RowContentProps> = ({
  text,
  leftIcon,
  renderLeftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <Container {...props} disabled={disabled || (!props.onPress && !props.onLongPress)}>
      {renderLeftIcon ? renderLeftIcon() : leftIcon && <Icon name={leftIcon} size={24} />}
      <Content>
        {text && <Text>{text}</Text>}
        {children}
      </Content>
      {rightIcon && <Icon name={rightIcon} size={24} />}
    </Container>
  );
};

export default RowContent;
