import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import HorizontalBar from '../../../../components/HorizontalBar';
import Icon from '../../../../components/Icon';
import Money from '../../../../components/Money';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { SectionHeader, SeeMoreButton } from '../commonStyles';
import {
  BalanceWithTrending,
  HorizontalBarContainer,
  SubSectionContainer,
  SummaryContainer,
} from './styles';

const SummarySection: React.FC = () => {
  const { hideValues, totalIncomes, totalExpenses } = useContext(AppContext);
  const navigation = useNavigation();

  const balance = totalIncomes - totalExpenses;

  const showTrendingIcon = !hideValues && balance !== 0;

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;
  const expensesSurplusGrow =
    totalIncomes >= totalExpenses ? 0 : (totalExpenses - totalIncomes) / totalExpenses;

  return (
    <SummaryContainer>
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
          Entradas
        </Text>
        <HorizontalBarContainer>
          <HorizontalBar color="income" grow={incomesBarGrow} />
          <Money value={totalIncomes} />
        </HorizontalBarContainer>
      </SubSectionContainer>
      <SubSectionContainer>
        <Text typography="defaultBold">Saídas</Text>
        <HorizontalBarContainer>
          <HorizontalBar color="expense" grow={expensesBarGrow} surplusGrow={expensesSurplusGrow} />
          <Money value={totalExpenses} />
        </HorizontalBarContainer>
      </SubSectionContainer>
    </SummaryContainer>
  );
};

export default SummarySection;
