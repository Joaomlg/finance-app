import { useNavigation } from '@react-navigation/native';
import moment, { Moment } from 'moment';
import React, { useContext, useState } from 'react';
import { LayoutAnimation, RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import Divider from '../../components/Divider';
import MonthYearPicker from '../../components/MonthYearPicker';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import AppContext from '../../contexts/AppContext';
import { NOW, checkCurrentMonth, formatMonthYearDate } from '../../utils/date';
import { capitalize } from '../../utils/text';
import BalanceSection from './components/BalanceSection';
import CategorySection from './components/CategorySection';
import SummarySection from './components/SummarySection/indes';
import TransactionsSection from './components/TransactionsSection';
import { StyledHeader, TopContainer } from './styles';

const MINIMUM_DATE = moment(new Date(0));

const Home: React.FC = () => {
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  const { fetchingWallets, fetchingTransactions, date, setDate, fetchWallets, fetchTransactions } =
    useContext(AppContext);

  const isCurrentMonth = checkCurrentMonth(date);

  const animatedChangeDate = (value: Moment) => {
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
            title={capitalize(formatMonthYearDate(date))}
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
          <SummarySection />
          <Divider />
          <CategorySection />
          <Divider />
          <TransactionsSection />
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
