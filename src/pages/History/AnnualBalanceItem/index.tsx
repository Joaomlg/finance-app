import React from 'react';
import Icon from '../../../components/Icon';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { AnnualBalance } from '../types';
import {
  AnnualBalanceContainer,
  AnnualBalanceContent,
  AnnualBalanceValueContainer,
} from './styles';

export interface AnnualBalanceItemProps {
  data: AnnualBalance;
}

const AnnualBalanceItem: React.FC<AnnualBalanceItemProps> = ({ data }) => {
  return (
    <AnnualBalanceContainer>
      <Text typography="defaultBold">{data.year}</Text>
      <AnnualBalanceContent>
        <AnnualBalanceValueContainer>
          <Icon name="arrow-downward" color="income" size={16} />
          <Money
            typography="defaultBold"
            color="income"
            value={data.incomes || 0}
            marked={!data.complete}
          />
        </AnnualBalanceValueContainer>
        <AnnualBalanceValueContainer>
          <Icon name="arrow-upward" color="expense" size={16} />
          <Money
            typography="defaultBold"
            color="expense"
            value={data.expenses || 0}
            marked={!data.complete}
          />
        </AnnualBalanceValueContainer>
      </AnnualBalanceContent>
    </AnnualBalanceContainer>
  );
};

export default AnnualBalanceItem;
