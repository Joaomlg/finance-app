import React, { useCallback, useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import AppContext from '../../contexts/AppContext';
import { Transaction } from '../../models';
import { formatMonthYearDate } from '../../utils/date';
import TransactionList from './TransactionList';
import TransactionTabs, { TransactionTabsRoute } from './TransactionTabs';
import { StyledHeader } from './styles';

const Transactions: React.FC = () => {
  const {
    isLoading,
    hideValues,
    setHideValues,
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
      <StyledHeader
        title={formatMonthYearDate(date)}
        actions={[
          {
            icon: hideValues ? 'visibility-off' : 'visibility',
            onPress: () => setHideValues(!hideValues),
          },
        ]}
      />
      <TransactionTabs renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Transactions;
