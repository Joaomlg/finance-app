import React, { useCallback, useContext, useState } from 'react';
import { useTheme } from 'styled-components/native';
import TransactionPieChart from '../../components/TransactionPieChart';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { CategoryType, CategoryTypeList, Transaction, Wallet } from '../../models';
import { insightsWalletTabTitle, transactionTypeText } from '../../utils/text';
import { useNavigation } from '@react-navigation/native';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';

const WALLET_TAB_KEY = 'WALLET';

const UNKNOWN_WALLET_NAME = 'Carteira desconhecida';

type InsightsSelection = { kind: 'category' | 'wallet'; id: string };

const TABS: TabProps[] = [
  ...CategoryTypeList.map(
    (type) =>
      ({
        key: type,
        title: transactionTypeText[type],
      } as TabProps),
  ),
  { key: WALLET_TAB_KEY, title: insightsWalletTabTitle },
];

const InsightsCategoryPieChartTab: React.FC<{
  type: CategoryType;
  transactions: Transaction[];
  onPress: (segmentId: string) => void;
}> = ({ type, transactions, onPress }) => {
  const getSegmentId = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).id,
    [type],
  );
  const getSegmentName = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).name,
    [type],
  );
  const getSegmentColor = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).color,
    [type],
  );

  return (
    <TransactionPieChart
      transactions={transactions}
      getSegmentId={getSegmentId}
      getSegmentName={getSegmentName}
      getSegmentColor={getSegmentColor}
      onPress={onPress}
    />
  );
};

const InsightsWalletPieChartTab: React.FC<{
  wallets: Wallet[];
  transactions: Transaction[];
  onPress: (segmentId: string) => void;
}> = ({ wallets, transactions, onPress }) => {
  const theme = useTheme();

  const getSegmentId = useCallback((t: Transaction) => t.walletId, []);

  const getSegmentName = useCallback(
    (t: Transaction) => wallets.find((w) => w.id === t.walletId)?.name ?? UNKNOWN_WALLET_NAME,
    [wallets],
  );

  const getSegmentColor = useCallback(
    (t: Transaction) =>
      wallets.find((w) => w.id === t.walletId)?.styles.primaryColor ?? theme.colors.lightGray,
    [wallets, theme.colors.lightGray],
  );

  return (
    <TransactionPieChart
      transactions={transactions}
      getSegmentId={getSegmentId}
      getSegmentName={getSegmentName}
      getSegmentColor={getSegmentColor}
      onPress={onPress}
    />
  );
};

const Insights: React.FC = () => {
  const [selection, setSelection] = useState<InsightsSelection | null>(null);

  const { expenseTransactions, incomeTransactions, transactions, wallets } = useContext(AppContext);
  const navigation = useNavigation();

  const handleCategoryPiePressed = useCallback((segmentId: string) => {
    setSelection((prev) =>
      prev?.kind === 'category' && prev.id === segmentId
        ? null
        : { kind: 'category', id: segmentId },
    );
  }, []);

  const handleWalletPiePressed = useCallback((segmentId: string) => {
    setSelection((prev) =>
      prev?.kind === 'wallet' && prev.id === segmentId ? null : { kind: 'wallet', id: segmentId },
    );
  }, []);

  const clearSelection = useCallback(() => setSelection(null), []);

  const renderScene = (tabKey: string) => {
    if (tabKey === WALLET_TAB_KEY) {
      return (
        <ScreenContent>
          <InsightsWalletPieChartTab
            wallets={wallets}
            transactions={transactions}
            onPress={handleWalletPiePressed}
          />
        </ScreenContent>
      );
    }

    const type = tabKey as CategoryType;
    const tabTransactions = (tabKey as CategoryType) === 'EXPENSE' ? expenseTransactions : incomeTransactions;

    return (
      <ScreenContent>
        <InsightsCategoryPieChartTab
          type={type}
          transactions={tabTransactions}
          onPress={handleCategoryPiePressed}
        />
      </ScreenContent>
    );
  };

  const hasSelection = selection && selection.id;

  const navigateToCategoryHistory = () => {
    if (selection?.kind === 'category') {
      navigation.navigate('categoryHistory', { categoryId: selection.id });
    }
  };
  
  const navigateToTransactions = () => {
    if (selection?.kind === 'category') {
      navigation.navigate('transactions', { categoryId: selection.id });
    } else if (selection?.kind === 'wallet') {
      navigation.navigate('transactions', { walletId: selection.id });
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Insights"
        actions={[
          {
            icon: 'history',
            hidden: !hasSelection || selection?.kind !== 'category',
            onPress: navigateToCategoryHistory,
          },
          {
            icon: 'receipt-long',
            hidden: !hasSelection,
            onPress: navigateToTransactions,
          },
          HideValuesAction(),
        ]}
      />
      <ScreenTabs tabs={TABS} renderScene={renderScene} onTabIndexChange={clearSelection} />
    </ScreenContainer>
  );
};

export default Insights;
