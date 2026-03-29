import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { Transaction, TransactionType } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatMonthYearDate } from '../../utils/date';
import { capitalize, transactionTypeText } from '../../utils/text';
import TransactionList from './TransactionList';

const Transactions: React.FC<NativeStackScreenProps<StackRouteParamList, 'transactions'>> = ({
  route,
  navigation,
}) => {
  const categoryId = route.params?.categoryId;

  const {
    fetchingTransactions,
    transactions,
    fetchTransactions,
    date,
    incomeTransactions,
    totalIncomes,
    expenseTransactions,
    totalExpenses,
  } = useContext(AppContext);

  const tabs: TabProps[] = [
    { key: 'default', title: 'Tudo' },
    { key: 'incomes', title: 'Receitas' },
    { key: 'expenses', title: 'Despesas' },
  ];

  const renderScene = useCallback(
    (tabKey: string) => {
      let data: Transaction[];
      let balance: number;

      switch (tabKey) {
        case 'incomes':
          data = incomeTransactions;
          balance = totalIncomes;
          break;
        case 'expenses':
          data = expenseTransactions;
          balance = totalExpenses;
          break;
        default:
          data = transactions;
          balance = totalIncomes - totalExpenses;
      }

      if (categoryId) {
        data = data.filter((transaction) => transaction.categoryId === categoryId);
        balance = data.reduce((total, item) => total + Math.abs(item.amount), 0);
      }

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
      categoryId,
      fetchingTransactions,
      fetchTransactions,
      incomeTransactions,
      totalIncomes,
      expenseTransactions,
      totalExpenses,
      transactions,
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
          actions={[HideValuesAction()]}
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
