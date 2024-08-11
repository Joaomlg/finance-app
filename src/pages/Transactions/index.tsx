import React, { useCallback, useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import AppContext from '../../contexts/AppContext';
import { Transaction } from '../../models';
import { formatMonthYearDate } from '../../utils/date';
import TransactionList from './TransactionList';
import TransactionTabs, { TransactionTabsRoute } from './TransactionTabs';

const Transactions: React.FC = () => {
  const {
    isLoading,
    transactions,
    fetchTransactions,
    date,
    incomeTransactions,
    totalIncomes,
    expenseTransactions,
    totalExpenses,
  } = useContext(AppContext);

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
          isLoading={isLoading}
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
      isLoading,
      totalExpenses,
      totalIncomes,
      transactions,
    ],
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={formatMonthYearDate(date)} actions={[HideValuesAction()]} />
      <TransactionTabs renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Transactions;
