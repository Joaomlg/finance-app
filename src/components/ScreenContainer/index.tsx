import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaProviderProps } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';
import { Container } from './styles';

export interface ScreenContainerProps extends SafeAreaProviderProps {
  variant?: 'default' | 'scrollable';
  refreshing?: boolean;
  onRefresh?: () => void;
  stickHeader?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  variant,
  refreshing,
  onRefresh,
  stickHeader,
  ...props
}) => {
  const theme = useTheme();

  const refreshControl =
    refreshing !== undefined || onRefresh !== undefined ? (
      <RefreshControl
        refreshing={refreshing || false}
        onRefresh={onRefresh}
        colors={[theme.colors.primary]}
      />
    ) : undefined;

  if (variant === 'scrollable' || refreshControl) {
    return (
      <Container {...props}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={stickHeader ? [0] : undefined}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      </Container>
    );
  }

  return <Container {...props}>{children}</Container>;
};

export default ScreenContainer;
