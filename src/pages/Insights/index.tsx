import React, { useContext } from 'react';
import CategoryPieChart from '../../components/CategoryPieChart';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { CategoryType, CategoryTypeList } from '../../models';
import { transactionTypeText } from '../../utils/text';

const TABS = CategoryTypeList.map(
  (type) =>
    ({
      key: type,
      title: transactionTypeText[type],
    } as TabProps),
);

const Insights: React.FC = () => {
  const { expenseTransactions, incomeTransactions } = useContext(AppContext);

  const renderScene = (tabKey: string) => {
    const transactions =
      (tabKey as CategoryType) === 'EXPENSE' ? expenseTransactions : incomeTransactions;

    return (
      <ScreenContent>
        <CategoryPieChart transactions={transactions} />
      </ScreenContent>
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Insights" actions={[HideValuesAction()]} />
      <ScreenTabs tabs={TABS} renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Insights;
