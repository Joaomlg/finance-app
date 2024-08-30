import React, { useContext } from 'react';
import { ViewProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppContext2 from '../../contexts/AppContext2';
import { Color } from '../../theme';
import { Bar, BarContainer } from './styles';

export interface HorizontalBarProps extends ViewProps {
  color: Color;
  grow?: number;
  surplusGrow?: number;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({
  grow,
  color,
  surplusGrow,
  ...viewProps
}) => {
  const { hideValues } = useContext(AppContext2);

  const theme = useTheme();

  const barColor = hideValues ? theme.colors.lightGray : theme.colors[color];

  const containerGrow = hideValues ? 1 : grow || 1;

  const surplusBarGrow = hideValues || !surplusGrow ? 0 : surplusGrow;
  const mainBarGrow = 1 - surplusBarGrow;

  return (
    <BarContainer flexGrow={containerGrow} {...viewProps}>
      <Bar backgroundColor={barColor} flexGrow={mainBarGrow} />
      <Bar backgroundColor={theme.colors.error} flexGrow={surplusBarGrow} />
    </BarContainer>
  );
};

export default HorizontalBar;
