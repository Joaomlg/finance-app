import { useNavigation } from '@react-navigation/native';
import { Moment } from 'moment';
import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  RefreshControl,
  ScrollView,
  UIManager,
} from 'react-native';
import { useTheme } from 'styled-components/native';
import Header from '../../components/Header';
import HorizontalBar from '../../components/HorizontalBar';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import MonthYearPicker from '../../components/MonthYearPicker';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import TransactionListItem from '../../components/TransactionListItem';
import AppContext from '../../contexts/AppContext';
import { NOW, checkCurrentMonth, formatMonthYearDate } from '../../utils/date';
import {
  BalanceContainer,
  BalanceFillLine,
  BalanceLine,
  BalanceWithTrending,
  BottomSheet,
  BottomSheetContent,
  ConnectionsButton,
  Divider,
  HorizontalBarContainer,
  SectionHeader,
  SeeMoreButton,
  SubSectionContainer,
  TopContainer,
  TransactionListContainer,
} from './styles';

const TRANSACTION_LIST_MIN_CAPACITY = 3;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Home: React.FC = () => {
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);
  const [transactionListCapacity, setTransactionListCapacity] = useState(0);

  const theme = useTheme();
  const navigation = useNavigation();

  const {
    isLoading,
    hideValues,
    date,
    setDate,
    minimumDateWithData,
    lastUpdateDate,
    setHideValues,
    updateConnections,
    fetchConnections,
    transactions,
    totalBalance,
    totalInvestment,
    totalInvoice,
    totalIncomes,
    totalExpenses,
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

  const handleRefreshPage = () => {
    Alert.alert(
      'Deseja sincronizar as conexões?',
      'Ao sincronizar as conexões, os dados mais recentes serão obtidos. Isso pode levar alguns minutos.\n\nAtualizar irá apenas obter o que já foi sincronizado previamente.',
      [
        {
          text: 'Atualizar',
          onPress: async () => {
            await fetchConnections();
          },
        },
        {
          text: 'Sincronizar',
          onPress: async () => {
            await updateConnections();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefreshPage}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <TopContainer>
          <Header
            title={formatMonthYearDate(date)}
            titleIcon="expand-more"
            onTitlePress={() => setMonthYearPickerOpened(true)}
            actions={[
              {
                icon: 'undo',
                onPress: () => animatedChangeDate(NOW),
                hidden: isCurrentMonth,
              },
              {
                icon: hideValues ? 'visibility-off' : 'visibility',
                onPress: () => setHideValues(!hideValues),
              },
              {
                icon: 'settings',
                onPress: () => navigation.navigate('settings'),
              },
            ]}
            hideGoBackIcon={true}
          />
          {isCurrentMonth && (
            <BalanceContainer>
              <Text variant="light" color="textWhite">
                Atualizado em {lastUpdateDate}
              </Text>
              <BalanceLine>
                <Text color="textWhite">Saldo das contas</Text>
                <BalanceFillLine />
                <Money value={totalBalance} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text color="textWhite">Fatura dos cartões</Text>
                <BalanceFillLine />
                <Money value={-1 * totalInvoice} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text color="textWhite">Investimentos</Text>
                <BalanceFillLine />
                <Money value={totalInvestment} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text variant="title" color="textWhite">
                  Total
                </Text>
                <BalanceFillLine />
                <Money
                  value={totalBalance + totalInvestment - totalInvoice}
                  variant="title"
                  color="textWhite"
                />
              </BalanceLine>
              <ConnectionsButton
                text="Ver minhas conexões"
                color="secondary"
                icon="account-balance"
                onPress={() => navigation.navigate('connections')}
              />
            </BalanceContainer>
          )}
        </TopContainer>
        <BottomSheet>
          <BottomSheetContent>
            <SectionHeader>
              <Text variant="title">Resumo do mês</Text>
              <SeeMoreButton text="Ver histórico" onPress={() => navigation.navigate('history')} />
            </SectionHeader>
            <BalanceWithTrending>
              <Text>
                Saldo: <Money value={balance} variant="default-bold" />
              </Text>
              {showTrendingIcon &&
                (balance > 0 ? (
                  <Icon name="trending-up" color="income" size={16} />
                ) : (
                  <Icon name="trending-down" color="error" size={16} />
                ))}
            </BalanceWithTrending>
            <SubSectionContainer>
              <Text variant="default-bold">Entradas</Text>
              <HorizontalBarContainer>
                <HorizontalBar color="income" grow={incomesBarGrow} />
                <Money value={totalIncomes} />
              </HorizontalBarContainer>
            </SubSectionContainer>
            <SubSectionContainer>
              <Text variant="default-bold">Saídas</Text>
              <HorizontalBarContainer>
                <HorizontalBar
                  color="expense"
                  grow={expensesBarGrow}
                  surplusGrow={expensesSurplusGrow}
                />
                <Money value={totalExpenses} />
              </HorizontalBarContainer>
            </SubSectionContainer>
          </BottomSheetContent>
          <Divider />
          <SectionHeader>
            <Text variant="title">Últimas transações</Text>
            <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('transactions')} />
          </SectionHeader>
          <TransactionListContainer onLayout={onTransactionListLayout}>
            {lastTransactions.map((transaction, index) => (
              <TransactionListItem item={transaction} key={index} />
            ))}
          </TransactionListContainer>
        </BottomSheet>
      </ScrollView>
      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        selectedDate={date}
        minimumDate={minimumDateWithData}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
    </ScreenContainer>
  );
};

export default Home;
