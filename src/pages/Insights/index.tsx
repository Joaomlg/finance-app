import React, { useCallback, useContext, useState } from 'react';
import { CategoryPieChart, WalletPieChart } from '../../components/TransactionPieChart';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import AppContext from '../../contexts/AppContext';
import { CategoryType, CategoryTypeList } from '../../models';
import { insightsWalletTabTitle, transactionTypeText } from '../../utils/text';
import { useNavigation } from '@react-navigation/native';

const WALLET_TAB_KEY = 'WALLET';

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

const Insights: React.FC = () => {
  const [selection, setSelection] = useState<InsightsSelection | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { expenseTransactions, incomeTransactions, wallets } = useContext(AppContext);
  const navigation = useNavigation();

  const activeTabKey = TABS[activeTabIndex].key;

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

  const handleTabIndexChange = useCallback((index: number) => {
    setActiveTabIndex(index);
    setSelection(null);
  }, []);

  const renderScene = (tabKey: string) => {
    const isActiveTab = tabKey === activeTabKey;

    if (tabKey === WALLET_TAB_KEY) {
      return (
        <ScreenContent>
          <WalletPieChart
            wallets={wallets}
            transactions={expenseTransactions}
            onPress={handleWalletPiePressed}
            isFocused={isActiveTab}
          />
        </ScreenContent>
      );
    }

    const type = tabKey as CategoryType;
    const tabTransactions = type === 'EXPENSE' ? expenseTransactions : incomeTransactions;

    return (
      <ScreenContent>
        <CategoryPieChart
          type={type}
          transactions={tabTransactions}
          onPress={handleCategoryPiePressed}
          isFocused={isActiveTab}
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
      <ScreenTabs tabs={TABS} renderScene={renderScene} onTabIndexChange={handleTabIndexChange} />
    </ScreenContainer>
  );
};

export default Insights;
