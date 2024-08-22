import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import AppContext2 from '../../contexts/AppContext2';
import { Transaction } from '../../models';
import { formatMonthYearDate } from '../../utils/date';
import TransactionList from './TransactionList';
import TransactionTabs, { TransactionTabsRoute } from './TransactionTabs';

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

  const renderScene = useCallback(
    ({ route }: { route: TransactionTabsRoute }) => {
      let data: Transaction[];
      let balance: number;

      switch (route.key) {
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

  const handleFloatingButtoPressed = () => {
    navigation.navigate('setTransaction');
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title={formatMonthYearDate(date)} actions={[HideValuesAction()]} />
        <TransactionTabs renderScene={renderScene} />
      </ScreenContainer>
      <ScreenFloatingButton onPress={handleFloatingButtoPressed} />
    </>
  );
};

export default Transactions;
