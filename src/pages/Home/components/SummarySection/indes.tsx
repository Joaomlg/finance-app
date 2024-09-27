import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import HorizontalBar from '../../../../components/HorizontalBar';
import Icon from '../../../../components/Icon';
import Money from '../../../../components/Money';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { SectionContainer, SectionHeader, SeeMoreButton } from '../commonStyles';
import { BalanceWithTrending, HorizontalBarContainer, SubSectionContainer } from './styles';

const SummarySection: React.FC = () => {
  const { totalIncomes, totalExpenses } = useContext(AppContext);
  const navigation = useNavigation();

  const balance = totalIncomes - totalExpenses;

  const showTrendingIcon = balance !== 0;

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;
  const expensesSurplusGrow =
    totalIncomes >= totalExpenses ? 0 : (totalExpenses - totalIncomes) / totalExpenses;

  return (
    <SectionContainer>
      <SectionHeader>
        <Text typography="title">Resumo do mês</Text>
        <SeeMoreButton text="Ver histórico" onPress={() => navigation.navigate('history')} />
      </SectionHeader>
      <BalanceWithTrending>
        <Text>
          Saldo: <Money value={balance} typography="defaultBold" />
        </Text>
        {showTrendingIcon &&
          (balance > 0 ? (
            <Icon name="trending-up" color="income" size={16} />
          ) : (
            <Icon name="trending-down" color="error" size={16} />
          ))}
      </BalanceWithTrending>
      <SubSectionContainer>
        <Text typography="defaultBold" transform="capitalize">
          Receitas
        </Text>
        <HorizontalBarContainer>
          <HorizontalBar color="income" grow={incomesBarGrow} />
          <Money value={totalIncomes} />
        </HorizontalBarContainer>
      </SubSectionContainer>
      <SubSectionContainer>
        <Text typography="defaultBold">Despesas</Text>
        <HorizontalBarContainer>
          <HorizontalBar color="expense" grow={expensesBarGrow} surplusGrow={expensesSurplusGrow} />
          <Money value={totalExpenses} />
        </HorizontalBarContainer>
      </SubSectionContainer>
    </SectionContainer>
  );
};

export default SummarySection;
