import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Category } from '../../models';
import { transactionRepository } from '../../repositories';
import { StackRouteParamList } from '../../routes/stack.routes';
import { range } from '../../utils/array';
import { getCategoryById } from '../../utils/category';
import { checkCurrentYear, CURRENT_MONTH } from '../../utils/date';
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
import { MonthData } from './types';

const ITEMS_PER_PAGE = 6;

const History: React.FC<NativeStackScreenProps<StackRouteParamList, 'categoryHistory'>> = ({
  route,
  navigation,
}) => {
  const categoryId = route.params?.categoryId;

  const [isLoading, setLoading] = useState(false);
  const [monthData, setMonthData] = useState([] as MonthData[]);
  const [page, setPage] = useState(0);

  const { setDate } = useContext(AppContext);

  const theme = useTheme();

  const category = getCategoryById(categoryId) as Category;

  const maxAmount = useMemo(() => {
    return monthData.reduce((currentMax, item) => Math.max(currentMax, item.amount), 0);
  }, [monthData]);

  const fetchPage = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setLoading(true);

    const dates = range(ITEMS_PER_PAGE).map((i) =>
      CURRENT_MONTH.clone().subtract(i + page * ITEMS_PER_PAGE, 'months'),
    );

    try {
      const results = await Promise.all(
        dates.map((date) =>
          transactionRepository.getTransactions({
            interval: {
              startDate: date.startOf('month').toDate(),
              endDate: date.endOf('month').toDate(),
            },
            order: {
              by: 'date',
              direction: 'desc',
            },
            categoryId,
          }),
        ),
      );

      const newDatas: MonthData[] = results.map((transactions, index) => {
        const amount = transactions
          .filter((transaction) => !transaction.ignore)
          .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

        return { date: dates[index], amount };
      });

      setMonthData((current) => (page === 0 ? newDatas : [...current, ...newDatas]));
      setPage((prev) => prev + 1);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter as transações!' });
    }

    setLoading(false);
  }, [categoryId, isLoading, page]);

  useEffect(() => {
    if (page === 0) {
      fetchPage();
    }
  }, [page, fetchPage]);

  const handleItemPress = useCallback(
    (item: MonthData) => {
      navigation.navigate('transactions', { categoryId });
      setDate(item.date);
    },
    [categoryId, navigation, setDate],
  );

  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    await fetchPage();
    setLoading(false);
  }, [fetchPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MonthData>) => {
      const dateText = checkCurrentYear(item.date)
        ? item.date.format('MMMM')
        : item.date.format('MMMM YYYY');

      const barGrow = maxAmount === 0 ? 1 : Math.max(item.amount / maxAmount, 0.005);

      return (
        <ItemContainer>
          <ItemHeader>
            <MonthTrendContainer>
              <Text typography="headingRegular" transform="capitalize">
                {dateText}
              </Text>
            </MonthTrendContainer>
            <TouchableIconContainer onPress={() => handleItemPress(item)}>
              <Icon name="navigate-next" size={28} />
            </TouchableIconContainer>
          </ItemHeader>
          <HorizontalBarContainer>
            <StyledHorizontalBar color={category.color} grow={barGrow} />
            <Money value={item.amount} typography="defaultBold" />
          </HorizontalBarContainer>
        </ItemContainer>
      );
    },
    [maxAmount, category.color, handleItemPress],
  );

  const renderItemSeparator = useCallback(() => <StyledDivider />, []);

  const renderFooter = useCallback(
    () =>
      monthData.length > 0 ? (
        <StyledButton onPress={handleLoadMore} isLoading={isLoading}>
          <Text typography="title" color="textWhite">
            Ver mais
          </Text>
        </StyledButton>
      ) : null,
    [handleLoadMore, isLoading, monthData],
  );

  const handleRefresh = useCallback(async () => {
    setPage(0);
    fetchPage();
  }, [fetchPage]);

  return (
    <ScreenContainer>
      <ScreenHeader title={`Histórico de "${category.name}"`} actions={[HideValuesAction()]} />
      <StyledFlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        data={monthData}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListFooterComponent={renderFooter}
      />
    </ScreenContainer>
  );
};

export default History;
