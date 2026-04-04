import React, { useCallback, useContext, useState } from 'react';
import TransactionPieChart from '../../components/TransactionPieChart';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { CategoryType, CategoryTypeList, Transaction } from '../../models';
import { transactionTypeText } from '../../utils/text';
import { useNavigation } from '@react-navigation/native';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';

const TABS = CategoryTypeList.map(
  (type) =>
    ({
      key: type,
      title: transactionTypeText[type],
    } as TabProps),
);

const InsightsPieChartTab: React.FC<{
  type: CategoryType;
  transactions: Transaction[];
  onPress: (segmentId: string) => void;
}> = ({ type, transactions, onPress }) => {
  const getSegmentId = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).id,
    [type],
  );
  const getSegmentName = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).name,
    [type],
  );
  const getSegmentColor = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).color,
    [type],
  );

  return (
    <TransactionPieChart
      transactions={transactions}
      getSegmentId={getSegmentId}
      getSegmentName={getSegmentName}
      getSegmentColor={getSegmentColor}
      onPress={onPress}
    />
  );
};

const Insights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const { expenseTransactions, incomeTransactions } = useContext(AppContext);
  const navigation = useNavigation();

  const handlePiePressed = (categoryId: string) => {
    setSelectedCategory((prev) => (categoryId === prev ? '' : categoryId));
  };

  const renderScene = (tabKey: string) => {
    const type = tabKey as CategoryType;

    const transactions = type === 'EXPENSE' ? expenseTransactions : incomeTransactions;

    return (
      <ScreenContent>
        <InsightsPieChartTab
          type={type}
          transactions={transactions}
          onPress={handlePiePressed}
        />
      </ScreenContent>
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Insights"
        actions={[
          {
            icon: 'history',
            hidden: !selectedCategory || selectedCategory === '',
            onPress: () => navigation.navigate('categoryHistory', { categoryId: selectedCategory }),
          },
          {
            icon: 'receipt-long',
            hidden: !selectedCategory || selectedCategory === '',
            onPress: () => navigation.navigate('transactions', { categoryId: selectedCategory }),
          },
          HideValuesAction(),
        ]}
      />
      <ScreenTabs tabs={TABS} renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Insights;
