import React, { useContext } from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppContext from '../../contexts/AppContext';
import light from '../../theme/light';

export interface HorizontalBarProps extends ViewProps {
  color: keyof typeof light.colors;
  grow?: number;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ grow, color, style, ...viewProps }) => {
  const { hideValues } = useContext(AppContext);

  const theme = useTheme();

  const backgroundColor = hideValues ? theme.colors.lightGray : theme.colors[color];

  const flexGrow = hideValues ? 1 : grow || 1;

  const barStyle = { backgroundColor, height: 12, borderRadius: 12, flexGrow };

  return <View style={[style, barStyle]} {...viewProps} />;
};

export default HorizontalBar;
