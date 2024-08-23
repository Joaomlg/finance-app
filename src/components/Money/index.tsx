import React, { useContext } from 'react';
import AppContext2 from '../../contexts/AppContext2';
import Text, { TextProps } from '../Text';

export type Signal = '+' | '-';

export interface MoneyProps extends TextProps {
  value: number;
}

const Money: React.FC<MoneyProps> = ({ value, ...textProps }) => {
  const { hideValues } = useContext(AppContext2);

  const formatedValue = Math.abs(value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  const currency = 'R$';

  const prefix = value < 0 ? '- ' : '';

  const finalText = `${prefix}${currency} ${formatedValue}`;

  return <Text {...textProps}>{hideValues ? '$$$$' : finalText}</Text>;
};

export default Money;
