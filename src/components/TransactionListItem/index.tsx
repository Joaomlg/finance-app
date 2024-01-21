import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ViewProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Transaction } from '../../models';
import Money from '../Money';
import Text from '../Text';

import { ListItem, ListItemAmount, ListItemContent } from './styles';

export interface TransactionListItemProps extends ViewProps {
  item: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ item, ...viewProps }) => {
  const theme = useTheme();

  const value = item.type === 'DEBIT' && item.amount > 0 ? -1 * item.amount : item.amount;

  return (
    <ListItem {...viewProps}>
      <MaterialIcons
        name={item.type === 'DEBIT' ? 'shopping-cart' : 'attach-money'}
        size={28}
        color={item.type === 'DEBIT' ? theme.colors.expense : theme.colors.income}
      />
      <ListItemContent>
        {item.category && (
          <Text variant="extra-light" color="textLight">
            {item.category}
          </Text>
        )}
        <Text numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
      </ListItemContent>
      <ListItemAmount>
        <Money variant="default-bold" value={value} />
      </ListItemAmount>
    </ListItem>
  );
};

export default TransactionListItem;
