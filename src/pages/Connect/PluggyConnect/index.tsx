import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { PluggyConnect as PluggyConnectWidget } from 'react-native-pluggy-connect';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import { StackRouteParamList } from '../../../routes/stack.routes';
import { Item } from '../../../services/pluggy';

import AppContext from '../../../contexts/AppContext';
import { buildPluggyProviderService } from '../../../services/providerServiceFactory';
import { Container } from './styles';

const PluggyConnect: React.FC<NativeStackScreenProps<StackRouteParamList, 'connect/pluggy'>> = ({
  route,
  navigation,
}) => {
  const updateConnectionId = route.params?.updateConnectionId;

  const [connectToken, setConnectToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { setupConnection } = useContext(AppContext);

  const theme = useTheme();

  const pluggyService = useMemo(buildPluggyProviderService, []);

  const handleOnSuccess = async (data: { item: Item }) => {
    const { item } = data;

    await setupConnection(item.id, 'PLUGGY');

    Toast.show({ type: 'success', text1: 'Conexão criada com sucesso!' });

    navigation.pop(2);
  };

  const handleOnError = async (error: { message: string; data?: { item: Item } }) => {
    const { data } = error;

    if (data) {
      await pluggyService.deleteConnection(data.item.id);
    }
  };

  const handleOnClose = () => {
    navigation.pop(2);
  };

  useEffect(() => {
    const createConnectToken = async () => {
      try {
        const accessToken = await pluggyService.createAccessToken(updateConnectionId);
        setConnectToken(accessToken);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Ocorreu um erro inesperado!' });
        navigation.goBack();
      }
      setIsLoading(false);
    };

    createConnectToken();
  }, [pluggyService, updateConnectionId, navigation]);

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <PluggyConnectWidget
          connectToken={connectToken}
          includeSandbox={__DEV__}
          countries={['BR']}
          connectorTypes={['PERSONAL_BANK', 'INVESTMENT']}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          onClose={handleOnClose}
          updateItem={updateConnectionId}
        />
      )}
    </Container>
  );
};

export default PluggyConnect;
