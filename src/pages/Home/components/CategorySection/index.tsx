import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { CategoryPieChart } from '../../../../components/TransactionPieChart';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { SectionContainer, SectionHeader, SeeMoreButton } from '../commonStyles';

const CategorySection: React.FC = () => {
  const { expenseTransactions } = useContext(AppContext);

  const navigation = useNavigation();

  return (
    <SectionContainer>
      <SectionHeader>
        <Text typography="title">Despesas por categoria</Text>
        <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('insights')} />
      </SectionHeader>
      <CategoryPieChart type="EXPENSE" transactions={expenseTransactions} variant="inline" />
    </SectionContainer>
  );
};

export default CategorySection;
