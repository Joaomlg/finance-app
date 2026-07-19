import React from 'react';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { Category } from '../../../models';
import { CategoryAnnualBalance } from '../types';
import { AnnualBalanceContainer, AnnualBalanceContent, ColorDot } from './styles';

export interface AnnualBalanceItemProps {
  data: CategoryAnnualBalance;
  category: Category;
}

const AnnualBalanceItem: React.FC<AnnualBalanceItemProps> = ({ data, category }) => {
  return (
    <AnnualBalanceContainer>
      <Text typography="defaultBold">{data.year}</Text>
      <AnnualBalanceContent>
        <ColorDot color={category.color} />
        <Money typography="defaultBold" value={data.amount || 0} marked={!data.complete} />
      </AnnualBalanceContent>
    </AnnualBalanceContainer>
  );
};

export default AnnualBalanceItem;
