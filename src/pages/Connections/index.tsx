import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Connection } from '../../models';
import ConnectionCard from '../Connections/ConnectionCard';
import { BottomSheet, BottomSheetContent, StyledHeader } from './styles';

const Connections: React.FC = () => {
  const { isLoading, connections, accounts, hideValues, setHideValues, fetchConnections } =
    useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const renderConnection = useCallback(
    (connection: Connection) => {
      const connectionAccounts = accounts.filter(
        (account) => account.connectionId === connection.id,
      );
      return (
        <ConnectionCard key={connection.id} connection={connection} accounts={connectionAccounts} />
      );
    },
    [accounts],
  );

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchConnections}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <StyledHeader
          title="Conexões"
          actions={[
            {
              icon: hideValues ? 'visibility-off' : 'visibility',
              onPress: () => setHideValues(!hideValues),
            },
            {
              icon: 'add-circle-outline',
              onPress: () => navigation.navigate('connect'),
              onLongPress: () => navigation.navigate('manualConnect'),
            },
          ]}
        ></StyledHeader>
        <BottomSheet>
          <Text variant="light" color="textLight">
            {connections.length} Conexões
          </Text>
          <BottomSheetContent>
            {connections.map((connection) => renderConnection(connection))}
          </BottomSheetContent>
        </BottomSheet>
      </ScrollView>
    </ScreenContainer>
  );
};

export default Connections;
