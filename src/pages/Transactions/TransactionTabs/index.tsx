import React, { useState } from 'react';
import { TabBar, TabBarProps, TabView } from 'react-native-tab-view';
import { useTheme } from 'styled-components/native';
import Text from '../../../components/Text';
import { TabLazyPlaceholder } from './styles';

type TransactionTabsRouteKey = 'default' | 'incomes' | 'expenses';

export type TransactionTabsRoute = {
  key: TransactionTabsRouteKey;
  title: string;
};

export interface TransactionTabsProps {
  renderScene: (props: { route: TransactionTabsRoute }) => React.ReactNode;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ renderScene }) => {
  const theme = useTheme();

  const [index, setIndex] = useState(0);

  const routes: TransactionTabsRoute[] = [
    { key: 'default', title: 'Tudo' },
    { key: 'incomes', title: 'Entradas' },
    { key: 'expenses', title: 'Saídas' },
  ];

  const renderTabBar = (props: TabBarProps<TransactionTabsRoute>) => (
    <TabBar
      {...props}
      pressColor={theme.colors.primary}
      style={{ backgroundColor: theme.colors.primary, marginHorizontal: 24, elevation: 0 }}
      indicatorStyle={{ backgroundColor: theme.colors.secondary, height: 2 }}
      renderLabel={({ route, color }) => (
        <Text variant="default-bold" style={{ color }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      lazy={({ route }) => route.key !== 'default'}
      renderLazyPlaceholder={() => <TabLazyPlaceholder />}
    />
  );
};

export default TransactionTabs;
