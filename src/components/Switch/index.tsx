import React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';
import { useTheme } from 'styled-components';

const Switch: React.FC<SwitchProps> = ({ value, ...props }) => {
  const theme = useTheme();

  return (
    <RNSwitch
      value={value}
      trackColor={{ false: theme.colors.lightGray, true: theme.colors.secondary }}
      {...props}
    />
  );
};

export default Switch;
