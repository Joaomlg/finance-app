import React, { useState } from 'react';
import { Switch as RNSwitch, SwitchProps, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';

const Switch: React.FC<SwitchProps> = ({ value, onValueChange, disabled, ...props }) => {
  const [internalDisabled, setInternalDisabled] = useState(false);

  const theme = useTheme();

  const handlePress = async () => {
    if (!onValueChange) {
      return;
    }

    setInternalDisabled(true);

    await onValueChange(!value);

    setInternalDisabled(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled || internalDisabled}>
      <RNSwitch
        value={value}
        trackColor={{ false: theme.colors.lightGray, true: theme.colors.secondary }}
        thumbColor={'white'}
        disabled={true}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default Switch;
