import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaProviderProps } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';
import { Container } from './styles';

export interface ScreenContainerProps extends SafeAreaProviderProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  stickHeader?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  refreshing,
  onRefresh,
  stickHeader,
  ...props
}) => {
  const theme = useTheme();

  if (refreshing !== undefined) {
    return (
      <Container {...props}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={stickHeader ? [0] : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        >
          {children}
        </ScrollView>
      </Container>
    );
  }

  return <Container {...props}>{children}</Container>;
};

export default ScreenContainer;
