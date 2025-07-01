import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { getCurrentYear } from '../../utils/date';
import AnnualBalanceItem from './AnnualBalanceItem';
import MonthlyBalanceItem from './MonthlyBalanceItem';
import { SectionDivider, StyledButton, StyledDivider, StyledSectionList } from './styles';
import { AnnualBalance } from './types';

const ITEMS_PER_PAGE = 4;

const CURRENT_YEAR = getCurrentYear();

const History: React.FC = () => {
  const [isLoadingMore, setLoadingMore] = useState(false);

  const {
    monthlyBalances,
    fetchMonthlyBalancesPage,
    fetchingMonthlyBalances,
    currentMonthlyBalancesPage,
    setCurrentMonthlyBalancesPage,
  } = useContext(AppContext);

  const theme = useTheme();

  const maxAmount = useMemo(() => {
    return monthlyBalances.reduce(
      (currentMax, item) => Math.max(currentMax, item.incomes, item.expenses),
      0,
    );
  }, [monthlyBalances]);

  const annualBalances = useMemo(() => {
    return monthlyBalances.reduce((summary, item) => {
      const year = item.date.year();
      const dataIndex = CURRENT_YEAR - year;

      if (summary.length <= dataIndex) {
        summary.push({
          year,
          incomes: 0,
          expenses: 0,
          data: [],
          complete: false,
        });

        if (dataIndex > 0) {
          summary[dataIndex - 1].complete = true;
        }
      }

      summary[dataIndex].incomes += item.incomes;
      summary[dataIndex].expenses += item.expenses;
      summary[dataIndex].data.push(item);

      return summary;
    }, [] as AnnualBalance[]);
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

  const renderItemSeparator = useCallback(() => <StyledDivider />, []);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    await fetchPage(currentMonthlyBalancesPage);
    setLoadingMore(false);
  }, [currentMonthlyBalancesPage, fetchPage]);

  const renderSectionFooter = useCallback(
    (section: AnnualBalance) => {
      return section.complete ? renderItemSeparator() : null;
    },
    [renderItemSeparator],
  );

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
      <ScreenHeader title="Histórico" actions={[HideValuesAction()]} />
      <StyledSectionList
        refreshControl={
          <RefreshControl
            refreshing={fetchingMonthlyBalances && !isLoadingMore}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        sections={annualBalances}
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={({ item }) => <MonthlyBalanceItem data={item} maxAmount={maxAmount} />}
        ItemSeparatorComponent={renderItemSeparator}
        renderSectionHeader={({ section }) => <AnnualBalanceItem data={section} />}
        SectionSeparatorComponent={() => <SectionDivider />}
        renderSectionFooter={({ section }) => renderSectionFooter(section)}
        ListFooterComponent={renderFooter}
        stickySectionHeadersEnabled={true}
      />
    </ScreenContainer>
  );
};

export default History;
