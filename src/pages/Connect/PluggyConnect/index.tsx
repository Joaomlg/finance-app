import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { PluggyConnect } from 'react-native-pluggy-connect';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import AppContext from '../../../contexts/AppContext';
import usePluggyService from '../../../hooks/pluggyService';
import { StackRouteParamList } from '../../../routes/stack.routes';
import { Item } from '../../../services/pluggy';

import { Container } from './styles';

const Connect: React.FC<NativeStackScreenProps<StackRouteParamList, 'connect'>> = ({
  route,
  navigation,
}) => {
  const updateItemId = route.params?.updateItemId;

  const [connectToken, setConnectToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { storeConnection } = useContext(AppContext);

  const pluggyService = usePluggyService();
  const theme = useTheme();

  const handleOnSuccess = async (data: { item: Item }) => {
    const { item } = data;

    await storeConnection(item.id);

    navigation.goBack();
  };

  const handleOnError = async (error: { message: string; data?: { item: Item } }) => {
    const { data } = error;

    if (data) {
      await storeConnection(data.item.id);
    }
  };

  const handleOnClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const createConnectToken = async () => {
      try {
        const accessToken = await pluggyService.createAccessToken(updateItemId);
        setConnectToken(accessToken);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Ocorreu um erro inesperado!' });
        navigation.goBack();
      }
      setIsLoading(false);
    };

    createConnectToken();
  }, [pluggyService, updateItemId, navigation]);

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={__DEV__}
          countries={['BR']}
          connectorTypes={['PERSONAL_BANK', 'INVESTMENT']}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          onClose={handleOnClose}
          updateItem={updateItemId}
        />
      )}
    </Container>
  );
};

export default Connect;
