import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Moment } from 'moment';
import React, { useContext, useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import HorizontalBar from '../../components/HorizontalBar';
import Money from '../../components/Money';
import MonthYearPicker from '../../components/MonthYearPicker';
import Text from '../../components/Text';
import TransactionListItem from '../../components/TransactionListItem';
import AppContext from '../../contexts/AppContext';
import {
  BalanceFillLine,
  BalanceLine,
  BottomSheet,
  ConnectionButtonContainer,
  ConnectionsButton,
  Container,
  Divider,
  Header,
  HeaderActions,
  HorizontalBarContainer,
  MonthButton,
  SeeMoreTransactionsButton,
  TopContainer,
  TransactionsListHeader,
} from './styles';

const LAST_TRANSACTIONS_COUNT = 3;

const Home: React.FC = () => {
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);

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
    transactions,
    totalBalance,
    totalInvestment,
    totalInvoice,
    totalIncomes,
    totalExpenses,
  } = useContext(AppContext);

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;

  const lastTransactions = useMemo(
    () => transactions.slice(0, LAST_TRANSACTIONS_COUNT),
    [transactions],
  );

  const handleMonthYearPickerChange = (value: Moment) => {
    setDate(value);
    setMonthYearPickerOpened(false);
  };

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={updateItems}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TopContainer>
          <Header>
            <MonthButton onPress={() => setMonthYearPickerOpened(true)}>
              <>
                <Text variant="heading" color="textWhite" transform="capitalize">
                  {date.format('MMMM')}
                </Text>
                <MaterialIcons name="expand-more" color={theme.colors.secondary} size={32} />
              </>
            </MonthButton>
            <HeaderActions>
              <MaterialIcons
                name={hideValues ? 'visibility-off' : 'visibility'}
                color={theme.colors.textWhite}
                size={32}
                onPress={() => setHideValues(!hideValues)}
              />
            </HeaderActions>
          </Header>
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
          <ConnectionsButton onPress={() => navigation.navigate('connections')}>
            <ConnectionButtonContainer>
              <Text variant="light-bold" color="secondary">
                Ver minhas conexões
              </Text>
              <MaterialIcons name="account-balance" color={theme.colors.secondary} size={14} />
            </ConnectionButtonContainer>
          </ConnectionsButton>
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
            <SeeMoreTransactionsButton onPress={() => navigation.navigate('transactions')}>
              <Text variant="light-bold" color="textLight">
                Ver mais
              </Text>
              <MaterialIcons name="navigate-next" color={theme.colors.textLight} size={14} />
            </SeeMoreTransactionsButton>
          </TransactionsListHeader>
          <FlexContainer gap={24}>
            {lastTransactions.map((item, index) => (
              <TransactionListItem item={item} key={index} />
            ))}
          </FlexContainer>
        </BottomSheet>
      </ScrollView>
      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
    </Container>
  );
};

export default Home;
