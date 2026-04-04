import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import TransactionPieChart from '../../../../components/TransactionPieChart';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { Transaction } from '../../../../models';
import { getCategoryById, getDefaultCategoryByType } from '../../../../utils/category';
import { SectionContainer, SectionHeader, SeeMoreButton } from '../commonStyles';

const resolveExpenseCategory = (t: Transaction) =>
  getCategoryById(t.categoryId) ?? getDefaultCategoryByType('EXPENSE');

const getExpenseSegmentId = (t: Transaction) => resolveExpenseCategory(t).id;

const getExpenseSegmentName = (t: Transaction) => resolveExpenseCategory(t).name;

const getExpenseSegmentColor = (t: Transaction) => resolveExpenseCategory(t).color;

const CategorySection: React.FC = () => {
  const { expenseTransactions } = useContext(AppContext);

  const navigation = useNavigation();

  return (
    <SectionContainer>
      <SectionHeader>
        <Text typography="title">Despesas por categoria</Text>
        <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('insights')} />
      </SectionHeader>
      <TransactionPieChart
        transactions={expenseTransactions}
        variant="inline"
        getSegmentId={getExpenseSegmentId}
        getSegmentName={getExpenseSegmentName}
        getSegmentColor={getExpenseSegmentColor}
      />
    </SectionContainer>
  );
};

export default CategorySection;
