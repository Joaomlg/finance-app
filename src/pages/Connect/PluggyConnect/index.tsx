import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { PluggyConnect as PluggyConnectWidget } from 'react-native-pluggy-connect';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import AppContext from '../../../contexts/AppContext';
import usePluggyService from '../../../hooks/usePluggyService';
import { StackRouteParamList } from '../../../routes/stack.routes';
import { Item } from '../../../services/pluggy';

import { Container } from './styles';

const PluggyConnect: React.FC<NativeStackScreenProps<StackRouteParamList, 'connect/pluggy'>> = ({
  route,
  navigation,
}) => {
  const updateConnectionId = route.params?.updateConnectionId;

  const [connectToken, setConnectToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { storeConnection } = useContext(AppContext);

  const pluggyService = usePluggyService();
  const theme = useTheme();

  const handleOnSuccess = async (data: { item: Item }) => {
    const { item } = data;

    const forceUpdate = updateConnectionId !== undefined;

    await storeConnection(item.id, 'PLUGGY', forceUpdate);

    Toast.show({ type: 'success', text1: 'Conexão criada com sucesso!' });

    navigation.pop(2);
  };

  const handleOnError = async (error: { message: string; data?: { item: Item } }) => {
    const { data } = error;

    if (data) {
      await storeConnection(data.item.id, 'PLUGGY');
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
