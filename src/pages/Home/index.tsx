import { useNavigation } from '@react-navigation/native';
import moment, { Moment } from 'moment';
import React, { useContext, useMemo, useState } from 'react';
import { LayoutAnimation, LayoutChangeEvent, RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import HorizontalBar from '../../components/HorizontalBar';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import MonthYearPicker from '../../components/MonthYearPicker';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import TransactionListItem from '../../components/TransactionListItem';
import AppContext from '../../contexts/AppContext';
import { NOW, checkCurrentMonth, formatMonthYearDate } from '../../utils/date';
import BalanceSection from './components/BalanceSection';
import {
  BalanceWithTrending,
  Divider,
  HorizontalBarContainer,
  SectionHeader,
  SeeMoreButton,
  StyledHeader,
  SubSectionContainer,
  SummaryContainer,
  TopContainer,
  TransactionListContainer,
} from './styles';

const TRANSACTION_LIST_MIN_CAPACITY = 3;
const MINIMUM_DATE = moment(new Date(0));

const Home: React.FC = () => {
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);
  const [transactionListCapacity, setTransactionListCapacity] = useState(0);

  const theme = useTheme();
  const navigation = useNavigation();

  const {
    fetchingWallets,
    fetchingTransactions,
    hideValues,
    date,
    setDate,
    transactions,
    totalIncomes,
    totalExpenses,
    fetchWallets,
    fetchTransactions,
  } = useContext(AppContext);

  const isCurrentMonth = checkCurrentMonth(date);

  const balance = totalIncomes - totalExpenses;

  const showTrendingIcon = !hideValues && balance !== 0;

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;
  const expensesSurplusGrow =
    totalIncomes >= totalExpenses ? 0 : (totalExpenses - totalIncomes) / totalExpenses;

  const lastTransactions = useMemo(() => {
    const amount = Math.max(transactionListCapacity, TRANSACTION_LIST_MIN_CAPACITY);
    return transactions.slice(0, amount);
  }, [transactions, transactionListCapacity]);

  const onTransactionListLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    const listCapacity = Math.round(height / (40 + 24));
    setTransactionListCapacity(listCapacity);
  };

  const animatedChangeDate = (value: Moment) => {
    const isNextValueCurrentMonth = checkCurrentMonth(value);

    if (isNextValueCurrentMonth) {
      setTransactionListCapacity(TRANSACTION_LIST_MIN_CAPACITY);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setDate(value);
  };

  const handleMonthYearPickerChange = (value: Moment) => {
    animatedChangeDate(value);
    setMonthYearPickerOpened(false);
  };

  const handleRefreshPage = async () => {
    await Promise.all([fetchWallets(), fetchTransactions()]);
  };

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={fetchingWallets || fetchingTransactions}
            onRefresh={handleRefreshPage}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <TopContainer>
          <StyledHeader
            title={formatMonthYearDate(date)}
            titleIcon="expand-more"
            onTitlePress={() => setMonthYearPickerOpened(true)}
            actions={[
              {
                icon: 'undo',
                onPress: () => animatedChangeDate(NOW),
                hidden: isCurrentMonth,
              },
              HideValuesAction(),
              {
                icon: 'settings',
                onPress: () => navigation.navigate('settings'),
              },
            ]}
            hideGoBackIcon={true}
          />
          {isCurrentMonth && <BalanceSection />}
        </TopContainer>
        <ScreenContent>
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
                <HorizontalBar
                  color="expense"
                  grow={expensesBarGrow}
                  surplusGrow={expensesSurplusGrow}
                />
                <Money value={totalExpenses} />
              </HorizontalBarContainer>
            </SubSectionContainer>
          </SummaryContainer>
          <Divider />
          <SectionHeader>
            <Text typography="title">Últimas transações</Text>
            <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('transactions')} />
          </SectionHeader>
          <TransactionListContainer onLayout={onTransactionListLayout}>
            {lastTransactions.map((transaction, index) => (
              <TransactionListItem item={transaction} key={index} />
            ))}
          </TransactionListContainer>
        </ScreenContent>
      </ScrollView>
      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        selectedDate={date}
        minimumDate={MINIMUM_DATE}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
    </ScreenContainer>
  );
};

export default Home;
