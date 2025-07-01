import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import Icon from '../../../components/Icon';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import AppContext, { MonthlyBalance } from '../../../contexts/AppContext';
import { checkCurrentYear } from '../../../utils/date';
import {
  HorizontalBarContainer,
  ItemContainer,
  ItemHeader,
  MonthTrendContainer,
  StyledHorizontalBar,
  TouchableIconContainer,
} from './styles';

export interface MonthlyBalanceItemProps {
  data: MonthlyBalance;
  maxAmount: number;
}

const MonthlyBalanceItem: React.FC<MonthlyBalanceItemProps> = ({ data, maxAmount }) => {
  const { date, incomes, expenses } = data;

  const { setDate } = useContext(AppContext);

  const navigation = useNavigation();

  const dateText = checkCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');

  const balance = incomes - expenses;

  const showTrendingIcon = balance !== 0;

  const incomesBarGrow = maxAmount === 0 ? 1 : Math.max(incomes / maxAmount, 0.005);
  const expensesBarGrow = maxAmount === 0 ? 1 : Math.max(expenses / maxAmount, 0.005);

  const expensesSurplusBarGrow = balance < 0 ? (expenses - incomes) / expenses : 0;

  const handleItemPress = useCallback(
    (item: MonthlyBalance) => {
      navigation.navigate('home');
      setDate(item.date);
    },
    [navigation, setDate],
  );

  return (
    <ItemContainer>
      <ItemHeader>
        <MonthTrendContainer>
          <Text typography="headingRegular" transform="capitalize">
            {dateText}
          </Text>
          {showTrendingIcon &&
            (balance > 0 ? (
              <Icon name="trending-up" color="income" size={24} />
            ) : (
              <Icon name="trending-down" color="error" size={24} />
            ))}
        </MonthTrendContainer>
        <TouchableIconContainer onPress={() => handleItemPress(data)}>
          <Icon name="navigate-next" size={28} />
        </TouchableIconContainer>
      </ItemHeader>
      <Text>
        Saldo: <Money value={balance} typography="defaultBold" />
      </Text>
      <HorizontalBarContainer>
        <StyledHorizontalBar color="income" grow={incomesBarGrow} />
        <Money value={incomes} typography="defaultBold" color="income" />
      </HorizontalBarContainer>
      <HorizontalBarContainer>
        <StyledHorizontalBar
          color="expense"
          grow={expensesBarGrow}
          surplusGrow={expensesSurplusBarGrow}
        />
        <Money
          value={expenses}
          typography="defaultBold"
          color={balance < 0 ? 'error' : 'expense'}
        />
      </HorizontalBarContainer>
    </ItemContainer>
  );
};

export default MonthlyBalanceItem;
