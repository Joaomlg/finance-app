import React, { useContext } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Category, Transaction } from '../../models';
import Money from '../Money';
import Text from '../Text';

import { useNavigation } from '@react-navigation/native';
import AppContext from '../../contexts/AppContext';
import useBottomSheet from '../../hooks/useBottomSheet';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import CategoryPicker from '../CategoryPicker';
import {
  CategoryIconContainer,
  ListItem,
  ListItemAmount,
  ListItemContent,
  StyledCategoryIcon,
} from './styles';

export interface TransactionListItemProps extends TouchableOpacityProps {
  item: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ item, ...props }) => {
  const value = item.type === 'EXPENSE' && item.amount > 0 ? -1 * item.amount : item.amount;

  const { wallets, updateTransaction } = useContext(AppContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const navigation = useNavigation();

  const wallet = wallets.find(({ id }) => id === item.walletId);
  const category = getCategoryById(item.categoryId) || getDefaultCategoryByType(item.type);

  const handleItemPressed = () => {
    navigation.navigate('transaction', {
      transactionId: item.id,
    });
  };

  const handleCategoryAvatarPressed = () => {
    openBottomSheet(renderTransactionCategorySelector());
  };

  const renderTransactionCategorySelector = () => {
    const handleItemPressed = async ({ id }: Category) => {
      await updateTransaction(item.id, { categoryId: id });
      closeBottomSheet();
    };

    return <CategoryPicker type={item.type} onPress={handleItemPressed} />;
  };

  return (
    <ListItem onPress={handleItemPressed} ignored={item.ignore} {...props}>
      <CategoryIconContainer onPress={handleCategoryAvatarPressed}>
        <StyledCategoryIcon category={category} ignored={item.ignore} />
      </CategoryIconContainer>
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
            {item.changed ? '*' : ''}
          </Text>
        )}
        <Money typography="defaultBold" value={value} strike={item.ignore} />
      </ListItemAmount>
    </ListItem>
  );
};

export default TransactionListItem;
