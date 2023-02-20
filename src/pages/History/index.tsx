import { MaterialIcons } from '@expo/vector-icons';
import { Moment } from 'moment';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { ActivityIndicator, ListRenderItemInfo, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { checkCurrentYear } from '../../utils/date';
import {
  Button,
  HorizontalBarContainer,
  StyledDivider,
  StyledFlatList,
  StyledHeader,
  StyledHorizontalBar,
} from './styles';

export type MonthBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

const ITEMS_PER_PAGE = 4;

const History: React.FC = () => {
  const {
    isLoading,
    hideValues,
    setHideValues,
    monthlyBalances,
    fetchMonthlyBalancesPage,
    currentMonthlyBalancesPage,
    setCurrentMonthlyBalancesPage,
    minimumDateWithData,
  } = useContext(AppContext);

  const theme = useTheme();

  const maxAmount = useMemo(() => {
    return monthlyBalances.reduce(
      (currentMax, item) => Math.max(currentMax, item.incomes, item.expenses),
      0,
    );
  }, [monthlyBalances]);

  const canLoadMore = useMemo(() => {
    if (monthlyBalances.length === 0) {
      return true;
    }

    const lastFetchedMonth = monthlyBalances[monthlyBalances.length - 1].date;
    return lastFetchedMonth.isAfter(minimumDateWithData);
  }, [minimumDateWithData, monthlyBalances]);

  const fetchPage = useCallback(
    async (page: number) => {
      await fetchMonthlyBalancesPage(ITEMS_PER_PAGE, page);
      setCurrentMonthlyBalancesPage(page + 1);
    },
    [fetchMonthlyBalancesPage, setCurrentMonthlyBalancesPage],
  );

  useEffect(() => {
    if (currentMonthlyBalancesPage === 0) {
      fetchPage(0);
    }
  }, [currentMonthlyBalancesPage, fetchPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MonthBalance>) => {
      const { date, incomes, expenses } = item;

      const dateText = checkCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');

      const balance = incomes - expenses;

      const showTrendingIcon = !hideValues && balance !== 0;

      const incomesBarGrow = maxAmount === 0 ? 1 : Math.max(incomes / maxAmount, 0.005);
      const expensesBarGrow = maxAmount === 0 ? 1 : Math.max(expenses / maxAmount, 0.005);

      const expensesSurplusBarGrow = balance < 0 ? (expenses - incomes) / expenses : 0;

      return (
        <FlexContainer gap={12}>
          <Text variant="heading-regular" transform="capitalize">
            {dateText}{' '}
            {showTrendingIcon &&
              (balance > 0 ? (
                <MaterialIcons name="trending-up" color={theme.colors.income} size={24} />
              ) : (
                <MaterialIcons name="trending-down" color={theme.colors.error} size={24} />
              ))}
          </Text>
          <Text>
            Saldo: <Money value={balance} variant="default-bold" />
          </Text>
          <HorizontalBarContainer>
            <StyledHorizontalBar color="income" grow={incomesBarGrow} />
            <Money value={incomes} variant="default-bold" color="income" />
          </HorizontalBarContainer>
          <HorizontalBarContainer>
            <StyledHorizontalBar
              color="expense"
              grow={expensesBarGrow}
              surplusGrow={expensesSurplusBarGrow}
            />
            <Money
              value={expenses}
              variant="default-bold"
              color={balance < 0 ? 'error' : 'expense'}
            />
          </HorizontalBarContainer>
        </FlexContainer>
      );
    },
    [hideValues, theme, maxAmount],
  );

  const renderItemSeparator = useCallback(() => <StyledDivider />, []);

  const renderFooter = useCallback(
    () =>
      monthlyBalances.length > 0 && canLoadMore ? (
        <Button onPress={() => fetchPage(currentMonthlyBalancesPage)}>
          {isLoading ? (
            <ActivityIndicator size={24} color={theme.colors.textWhite} />
          ) : (
            <Text variant="title" color="textWhite">
              Ver mais
            </Text>
          )}
        </Button>
      ) : null,
    [
      canLoadMore,
      currentMonthlyBalancesPage,
      fetchPage,
      isLoading,
      monthlyBalances.length,
      theme.colors.textWhite,
    ],
  );

  const handleRefresh = useCallback(async () => {
    fetchPage(0);
  }, [fetchPage]);

  return (
    <ScreenContainer>
      <StyledHeader
        title="Histórico mensal"
        actions={[
          {
            icon: hideValues ? 'visibility-off' : 'visibility',
            onPress: () => setHideValues(!hideValues),
          },
        ]}
      />
      <StyledFlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading || false}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        data={monthlyBalances}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListFooterComponent={renderFooter}
      />
    </ScreenContainer>
  );
};

export default History;
