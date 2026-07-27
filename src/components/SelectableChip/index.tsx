import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import Text from '../Text';
import { Container } from './styles';

export interface SelectableChipProps extends TouchableOpacityProps {
  text: string;
  selected?: boolean;
}

const SelectableChip: React.FC<SelectableChipProps> = ({ text, selected, ...props }) => {
  return (
    <Container selected={selected} {...props}>
      <Text typography="defaultBold" color={selected ? 'textWhite' : 'text'}>
        {text}
      </Text>
    </Container>
  );
};

export default SelectableChip;
