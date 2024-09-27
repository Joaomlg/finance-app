import React from 'react';
import { ViewProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Color } from '../../theme';
import { Bar, BarContainer } from './styles';

export interface HorizontalBarProps extends ViewProps {
  color: Color | string;
  grow?: number;
  surplusGrow?: number;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({
  grow,
  color,
  surplusGrow,
  ...viewProps
}) => {
  const theme = useTheme();

  const barColor = theme.colors[color as Color] || color;

  const containerGrow = grow || 1;

  const surplusBarGrow = !surplusGrow ? 0 : surplusGrow;
  const mainBarGrow = 1 - surplusBarGrow;

  return (
    <BarContainer flexGrow={containerGrow} {...viewProps}>
      <Bar backgroundColor={barColor} flexGrow={mainBarGrow} />
      <Bar backgroundColor={theme.colors.error} flexGrow={surplusBarGrow} />
    </BarContainer>
  );
};

export default HorizontalBar;
