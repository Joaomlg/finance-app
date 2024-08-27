import React, { useContext } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Transaction } from '../../models';
import Money from '../Money';
import Text from '../Text';

import { useNavigation } from '@react-navigation/native';
import AppContext2 from '../../contexts/AppContext2';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import { ListItem, ListItemAmount, ListItemContent, StyledCategoryIcon } from './styles';

export interface TransactionListItemProps extends TouchableOpacityProps {
  item: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ item, ...props }) => {
  const value = item.type === 'DEBIT' && item.amount > 0 ? -1 * item.amount : item.amount;

  const { wallets } = useContext(AppContext2);
  const navigation = useNavigation();

  const wallet = wallets.find(({ id }) => id === item.walletId);
  const category = getCategoryById(item.categoryId) || getDefaultCategoryByType(item.type);

  const handleItemPressed = () => {
    navigation.navigate('transaction', {
      transactionId: item.id,
    });
  };

  return (
    <ListItem onPress={handleItemPressed} ignored={item.ignore} {...props}>
      <StyledCategoryIcon category={category} ignored={item.ignore} />
      <ListItemContent>
        {category.name && (
          <Text typography="extraLight" color="textLight">
            {category.name}
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
        <Money typography="defaultBold" value={value} strike={item.ignore} />
      </ListItemAmount>
    </ListItem>
  );
};

export default TransactionListItem;
