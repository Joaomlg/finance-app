import React, { useContext, useState } from 'react';
import CategoryPieChart from '../../components/CategoryPieChart';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { CategoryType, CategoryTypeList } from '../../models';
import { transactionTypeText } from '../../utils/text';
import { useNavigation } from '@react-navigation/native';

const TABS = CategoryTypeList.map(
  (type) =>
    ({
      key: type,
      title: transactionTypeText[type],
    } as TabProps),
);

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
        <CategoryPieChart transactions={transactions} type={type} onPress={handlePiePressed} />
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
