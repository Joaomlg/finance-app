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
import FlexContainer from '../../components/FlexContainer';
import Header from '../../components/Header';
import HorizontalBar from '../../components/HorizontalBar';
import Money from '../../components/Money';
import MonthYearPicker from '../../components/MonthYearPicker';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import TransactionListItem from '../../components/TransactionListItem';
import AppContext from '../../contexts/AppContext';
import { checkCurrentMonth, formatMonthYearDate, NOW } from '../../utils/date';
import {
  BalanceContainer,
  BalanceFillLine,
  BalanceLine,
  BottomSheet,
  ConnectionsButton,
  Divider,
  HorizontalBarContainer,
  SeeMoreTransactionsButton,
  TopContainer,
  TransactionListContainer,
  TransactionsListHeader,
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
    lastUpdateDate,
    setHideValues,
    updateItems,
    fetchItems,
    transactions,
    totalBalance,
    totalInvestment,
    totalInvoice,
    totalIncomes,
    totalExpenses,
  } = useContext(AppContext);

  const isCurrentMonth = checkCurrentMonth(date);

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;

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
            await fetchItems();
          },
        },
        {
          text: 'Sincronizar',
          onPress: async () => {
            await updateItems();
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
          <FlexContainer gap={16}>
            <Text variant="title">Resumo do mês</Text>
            <Text>
              Saldo: <Money value={totalIncomes - totalExpenses} variant="default-bold" />
            </Text>
            <FlexContainer gap={12}>
              <Text variant="default-bold">Entradas</Text>
              <HorizontalBarContainer>
                <HorizontalBar color="income" grow={incomesBarGrow} />
                <Money value={totalIncomes} />
              </HorizontalBarContainer>
            </FlexContainer>
            <FlexContainer gap={12}>
              <Text variant="default-bold">Saídas</Text>
              <HorizontalBarContainer>
                <HorizontalBar color="expense" grow={expensesBarGrow} />
                <Money value={totalExpenses} />
              </HorizontalBarContainer>
            </FlexContainer>
          </FlexContainer>
          <Divider />
          <TransactionsListHeader>
            <Text variant="title">Últimas transações</Text>
            <SeeMoreTransactionsButton
              text="Ver mais"
              color="textLight"
              icon="navigate-next"
              iconGap={0}
              onPress={() => navigation.navigate('transactions')}
            />
          </TransactionsListHeader>
          <TransactionListContainer onLayout={onTransactionListLayout}>
            {lastTransactions.map((item, index) => (
              <TransactionListItem item={item} key={index} />
            ))}
          </TransactionListContainer>
        </BottomSheet>
      </ScrollView>
      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        selectedDate={date}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
    </ScreenContainer>
  );
};

export default Home;
