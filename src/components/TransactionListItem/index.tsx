import React, { useContext } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Transaction } from '../../models';
import Money from '../Money';
import Text from '../Text';

import { useNavigation } from '@react-navigation/native';
import AppContext2 from '../../contexts/AppContext2';
import Icon from '../Icon';
import { ListItem, ListItemAmount, ListItemContent } from './styles';

export interface TransactionListItemProps extends TouchableOpacityProps {
  item: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ item, ...props }) => {
  const value = item.type === 'DEBIT' && item.amount > 0 ? -1 * item.amount : item.amount;

  const { wallets } = useContext(AppContext2);
  const navigation = useNavigation();

  const wallet = wallets.find(({ id }) => id === item.walletId);

  const handleItemPressed = () => {
    navigation.navigate('transaction', {
      transactionId: item.id,
    });
  };

  return (
    <ListItem onPress={handleItemPressed} {...props}>
      <Icon
        name={item.type === 'DEBIT' ? 'shopping-cart' : 'attach-money'}
        size={28}
        color={item.type === 'DEBIT' ? 'expense' : 'income'}
      />
      <ListItemContent>
        {item.category && (
          <Text typography="extraLight" color="textLight">
            {item.category}
          </Text>
        )}
        <Text numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
      </ListItemContent>
      <ListItemAmount>
        {wallet?.name && (
          <Text typography="extraLight" color="textLight">
            {wallet.name}
          </Text>
        )}
        <Money typography="defaultBold" value={value} />
      </ListItemAmount>
    </ListItem>
  );
};

export default TransactionListItem;
