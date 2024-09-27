import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext, { MonthlyBalance } from '../../contexts/AppContext';
import { checkCurrentYear } from '../../utils/date';
import {
  HorizontalBarContainer,
  ItemContainer,
  ItemHeader,
  MonthTrendContainer,
  StyledButton,
  StyledDivider,
  StyledFlatList,
  StyledHorizontalBar,
  TouchableIconContainer,
} from './styles';

const ITEMS_PER_PAGE = 4;

const History: React.FC = () => {
  const [isLoadingMore, setLoadingMore] = useState(false);

  const {
    monthlyBalances,
    fetchMonthlyBalancesPage,
    fetchingMonthlyBalances,
    currentMonthlyBalancesPage,
    setCurrentMonthlyBalancesPage,
    setDate,
  } = useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const maxAmount = useMemo(() => {
    return monthlyBalances.reduce(
      (currentMax, item) => Math.max(currentMax, item.incomes, item.expenses),
      0,
    );
  }, [monthlyBalances]);

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

  const handleItemPress = useCallback(
    (item: MonthlyBalance) => {
      navigation.navigate('transactions');
      setDate(item.date);
    },
    [navigation, setDate],
  );

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    await fetchPage(currentMonthlyBalancesPage);
    setLoadingMore(false);
  }, [currentMonthlyBalancesPage, fetchPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MonthlyBalance>) => {
      const { date, incomes, expenses } = item;

      const dateText = checkCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');

      const balance = incomes - expenses;

      const showTrendingIcon = balance !== 0;

      const incomesBarGrow = maxAmount === 0 ? 1 : Math.max(incomes / maxAmount, 0.005);
      const expensesBarGrow = maxAmount === 0 ? 1 : Math.max(expenses / maxAmount, 0.005);

      const expensesSurplusBarGrow = balance < 0 ? (expenses - incomes) / expenses : 0;

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
            <TouchableIconContainer onPress={() => handleItemPress(item)}>
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
    },
    [maxAmount, handleItemPress],
  );

  const renderItemSeparator = useCallback(() => <StyledDivider />, []);

  const renderFooter = useCallback(
    () =>
      monthlyBalances.length > 0 ? (
        <StyledButton onPress={handleLoadMore} isLoading={fetchingMonthlyBalances}>
          <Text typography="title" color="textWhite">
            Ver mais
          </Text>
        </StyledButton>
      ) : null,
    [handleLoadMore, fetchingMonthlyBalances, monthlyBalances],
  );

  const handleRefresh = useCallback(async () => {
    fetchPage(0);
  }, [fetchPage]);

  return (
    <ScreenContainer>
      <ScreenHeader title="Histórico mensal" actions={[HideValuesAction()]} />
      <StyledFlatList
        refreshControl={
          <RefreshControl
            refreshing={fetchingMonthlyBalances && !isLoadingMore}
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
