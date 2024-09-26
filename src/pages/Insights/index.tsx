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
    const transactions =
      (tabKey as CategoryType) === 'EXPENSE' ? expenseTransactions : incomeTransactions;

    return (
      <ScreenContent>
        <CategoryPieChart transactions={transactions} onPress={handlePiePressed} />
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
            hidden: selectedCategory === '',
            onPress: () => navigation.navigate('categoryHistory', { categoryId: selectedCategory }),
          },
          HideValuesAction(),
        ]}
      />
      <ScreenTabs tabs={TABS} renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Insights;
