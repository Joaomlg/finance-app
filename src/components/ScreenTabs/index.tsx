import React, { useState } from 'react';
import { TabBar, TabBarProps, TabView } from 'react-native-tab-view';
import { useTheme } from 'styled-components/native';
import Text from '../Text';
import { TabLazyPlaceholder } from './styles';

export type TabProps = {
  key: string;
  title: string;
};

export interface ScreenTabsProps {
  tabs: TabProps[];
  renderScene: (tabKey: string) => React.ReactNode;
}

const ScreenTabs: React.FC<ScreenTabsProps> = ({ tabs, renderScene }) => {
  const theme = useTheme();

  const [index, setIndex] = useState(0);

  const renderTabBar = (props: TabBarProps<TabProps>) => (
    <TabBar
      {...props}
      pressColor={theme.colors.primary}
      style={{ backgroundColor: theme.colors.primary, marginHorizontal: 24, elevation: 0 }}
      indicatorStyle={{ backgroundColor: theme.colors.secondary, height: 2 }}
      renderLabel={({ route, color }) => (
        <Text typography="defaultBold" style={{ color }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes: tabs }}
      renderScene={({ route }) => renderScene(route.key)}
      sceneContainerStyle={{
        borderRightWidth: 0.2,
        borderRightColor: theme.colors.primary,
        borderLeftWidth: 0.2,
        borderLeftColor: theme.colors.primary,
      }}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      lazy={({ route }) => route.key !== 'default'}
      renderLazyPlaceholder={() => <TabLazyPlaceholder />}
    />
  );
};

export default ScreenTabs;
