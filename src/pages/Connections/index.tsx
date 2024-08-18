import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Connection } from '../../models';
import ConnectionCard from '../Connections/ConnectionCard';

const Connections: React.FC = () => {
  const { isLoading, connections, accounts, fetchConnections } = useContext(AppContext);

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
        <ScreenHeader
          title="Conexões"
          actions={[
            HideValuesAction(),
            {
              icon: 'add-circle-outline',
              onPress: () => navigation.navigate('connect'),
              onLongPress: () => navigation.navigate('manualConnect'),
            },
          ]}
        />
        <ScreenContent>
          <Text typography="light" color="textLight">
            {connections.length} Conexões
          </Text>
          {connections.map((connection) => renderConnection(connection))}
        </ScreenContent>
      </ScrollView>
    </ScreenContainer>
  );
};

export default Connections;
