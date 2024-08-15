import React, { useRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'styled-components';
import { Color, Typography } from '../../theme';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Container, Field, FieldWithPrefixContainer } from './styles';

export interface TextInputProps extends RNTextInputProps {
  iconLeft?: IconName;
  iconRight?: IconName;
  color?: Color;
  typography?: Typography;
  textPrefix?: string;
  onPress?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  iconLeft,
  iconRight,
  color,
  typography,
  textPrefix,
  onPress,
  ...rnProps
}) => {
  const fieldRef = useRef<RNTextInput>(null);

  const theme = useTheme();

  const fieldFocus = () => {
    if (!fieldRef || !fieldRef.current) return;
    fieldRef.current.blur();
    fieldRef.current.focus();
  };

  const onFieldPress = () => {
    if (onPress) {
      onPress();
    } else {
      fieldFocus();
    }
  };

  const renderField = () => {
    return (
      <Field
        ref={fieldRef}
        cursorColor={theme.colors.secondary}
        placeholderTextColor={theme.colors[color || 'text']}
        selectionColor={theme.colors.secondary}
        style={{
          color: theme.colors[color || 'text'],
          ...theme.typography[typography || 'default'],
        }}
        blurOnSubmit={true}
        {...rnProps}
      />
    );
  };

  return (
    <TouchableOpacity onPress={onFieldPress} activeOpacity={onPress ? 0.2 : 1}>
      <Container>
        {iconLeft && <Icon name={iconLeft} size={24} color={color} />}
        {textPrefix ? (
          <FieldWithPrefixContainer>
            <Text color={color} typography={typography}>
              {textPrefix}
            </Text>
            {renderField()}
          </FieldWithPrefixContainer>
        ) : (
          renderField()
        )}
        {iconRight && <Icon name={iconRight} size={24} color={color} />}
      </Container>
    </TouchableOpacity>
  );
};

export default TextInput;