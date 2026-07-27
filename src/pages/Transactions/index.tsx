import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import useBottomSheet from '../../hooks/useBottomSheet';
import { Category, Transaction, TransactionType } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import { formatMonthYearDate } from '../../utils/date';
import { getTransactionSignedAmount } from '../../utils/money';
import { capitalize, textCompare, transactionTypeText } from '../../utils/text';
import {
  countActiveFilters,
  DEFAULT_TRANSACTION_FILTERS,
  filterTransactions,
  TransactionFilters,
  UNCATEGORIZED_ID,
} from '../../utils/transaction';
import TransactionFilterSheet from './TransactionFilterSheet';
import TransactionList from './TransactionList';

const Transactions: React.FC<NativeStackScreenProps<StackRouteParamList, 'transactions'>> = ({
  route,
  navigation,
}) => {
  const categoryId = route.params?.categoryId;
  const walletId = route.params?.walletId;

  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_TRANSACTION_FILTERS);

  const {
    fetchingTransactions,
    transactions,
    fetchTransactions,
    date,
    incomeTransactions,
    expenseTransactions,
    wallets,
    walletGroups,
  } = useContext(AppContext);

  const { openBottomSheet } = useBottomSheet();

  useEffect(() => {
    if (!categoryId && !walletId) {
      return;
    }

    const wallet = wallets.find((item) => item.id === walletId);

    setFilters({
      ...DEFAULT_TRANSACTION_FILTERS,
      categoryIds: categoryId ? [categoryId] : [],
      walletGroupIds: wallet ? [wallet.walletGroupId] : [],
      walletTypes: wallet ? [wallet.type] : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, walletId]);

  const usedCategories = useMemo(() => {
    const categories = new Map<string, Category>();

    const addCategory = (id?: string) => {
      const category = getCategoryById(id);

      if (category) {
        categories.set(category.id, category);
      } else {
        categories.set(UNCATEGORIZED_ID, {
          ...getDefaultCategoryByType('EXPENSE'),
          id: UNCATEGORIZED_ID,
        });
      }
    };

    transactions.forEach((transaction) => addCategory(transaction.categoryId));
    filters.categoryIds.forEach(addCategory);

    return [...categories.values()].sort((a, b) => textCompare(a.name, b.name));
  }, [transactions, filters.categoryIds]);

  const tabs: TabProps[] = [
    { key: 'default', title: 'Tudo' },
    { key: 'incomes', title: 'Receitas' },
    { key: 'expenses', title: 'Despesas' },
  ];

  const renderScene = useCallback(
    (tabKey: string) => {
      let data: Transaction[];

      switch (tabKey) {
        case 'incomes':
          data = incomeTransactions;
          break;
        case 'expenses':
          data = expenseTransactions;
          break;
        default:
          data = transactions;
      }

      data = filterTransactions(data, filters, wallets);

      const balance = data
        .filter((transaction) => !transaction.ignore)
        .reduce((total, item) => total + getTransactionSignedAmount(item), 0);

      return (
        <TransactionList
          isLoading={fetchingTransactions}
          onRefresh={fetchTransactions}
          transactions={data}
          reducedValue={balance}
        />
      );
    },
    [
      fetchingTransactions,
      fetchTransactions,
      incomeTransactions,
      expenseTransactions,
      transactions,
      filters,
      wallets,
    ],
  );

  const handleFloatingButtoPressed = (transactionType: TransactionType) => {
    navigation.navigate('setTransaction', { transactionType });
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader
          title={capitalize(formatMonthYearDate(date))}
          actions={[
            HideValuesAction(),
            {
              icon: 'filter-alt',
              badge: countActiveFilters(filters),
              onPress: () =>
                openBottomSheet(
                  <TransactionFilterSheet
                    initialFilters={filters}
                    categories={usedCategories}
                    walletGroups={walletGroups}
                    onChange={setFilters}
                  />,
                ),
            },
          ]}
        />
        <ScreenTabs tabs={tabs} renderScene={renderScene} />
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          {
            text: 'Adicionar ' + transactionTypeText['INCOME'],
            icon: 'attach-money',
            onPress: () => handleFloatingButtoPressed('INCOME'),
          },
          {
            text: 'Adicionar ' + transactionTypeText['EXPENSE'],
            icon: 'shopping-cart',
            onPress: () => handleFloatingButtoPressed('EXPENSE'),
          },
        ]}
      />
    </>
  );
};

export default Transactions;
