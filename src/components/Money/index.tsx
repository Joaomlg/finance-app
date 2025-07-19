import React, { useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Text, { TextProps } from '../Text';

export type Signal = '+' | '-';

export interface MoneyProps extends TextProps {
  value: number;
  marked?: boolean;
}

const Money: React.FC<MoneyProps> = ({ value, marked, ...textProps }) => {
  const { hideValues } = useContext(AppContext);

  const formatedValue = Math.abs(value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  const currency = 'R$';

  const prefix = value < 0 ? '- ' : '';

  const suffix = marked ? '*' : '';

  const finalText = `${prefix}${currency} ${formatedValue}${suffix}`;

  return <Text {...textProps}>{hideValues ? '$$$$' : finalText}</Text>;
};

export default Money;
