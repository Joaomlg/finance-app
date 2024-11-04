import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import CategoryPieChart from '../../../../components/CategoryPieChart';
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
      <CategoryPieChart transactions={expenseTransactions} type="EXPENSE" variant="inline" />
    </SectionContainer>
  );
};

export default CategorySection;
