import React, { useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import TextInput, { TextInputProps } from '../TextInput';
import { formatMoney } from '../../utils/money';

export interface CurrencyInputProps extends TextInputProps {
  defaultNumberValue?: number;
  onChangeValue?: (value: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  defaultNumberValue,
  onKeyPress,
  onChangeValue,
  ...props
}) => {
  const [internalValue, setInternalalue] = useState(defaultNumberValue || 0);

  const keyPressed = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    event.preventDefault();

    if (onKeyPress) keyPressed(event);

    const key = event.nativeEvent.key;

    let newValue = internalValue;

    if (key === 'Backspace') {
      newValue = Math.trunc(newValue * 10) / 100;
    }

    const intKey = parseInt(key);

    if (!isNaN(intKey)) {
      newValue = newValue * 10 + intKey / 100;
    }

    setInternalalue(newValue);

    if (onChangeValue) onChangeValue(newValue);
  };

  return (
    <TextInput
      textPrefix="R$ "
      placeholder="0,00"
      keyboardType="decimal-pad"
      value={formatMoney({ value: internalValue })}
      onKeyPress={keyPressed}
      {...props}
    />
  );
};

export default CurrencyInput;
