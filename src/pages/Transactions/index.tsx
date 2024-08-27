import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext2 from '../../contexts/AppContext2';
import { Transaction, TransactionType } from '../../models';
import { formatMonthYearDate } from '../../utils/date';
import { transactionTypeText } from '../../utils/text';
import TransactionList from './TransactionList';

const Transactions: React.FC = () => {
  const navigation = useNavigation();

  const {
    fetchingTransactions,
    transactions,
    fetchTransactions,
    date,
    incomeTransactions,
    totalIncomes,
    expenseTransactions,
    totalExpenses,
  } = useContext(AppContext2);

  const tabs: TabProps[] = [
    { key: 'default', title: 'Tudo' },
    { key: 'incomes', title: 'Entradas' },
    { key: 'expenses', title: 'Saídas' },
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
      expenseTransactions,
      fetchTransactions,
      incomeTransactions,
      fetchingTransactions,
      totalExpenses,
      totalIncomes,
      transactions,
    ],
  );

  const handleFloatingButtoPressed = (transactionType: TransactionType) => {
    navigation.navigate('setTransaction', { transactionType });
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title={formatMonthYearDate(date)} actions={[HideValuesAction()]} />
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
