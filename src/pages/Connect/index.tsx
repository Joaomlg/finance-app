import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, Text } from 'react-native';
import { PluggyConnect } from 'react-native-pluggy-connect';
import usePluggyService from '../../hooks/pluggyService';
import { Item } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import { Container } from './styles';

const Connect: React.FC = () => {
  const [connectToken, setConnectToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const pluggyService = usePluggyService();

  const navigation = useNavigation();

  const handleOnSuccess = async (data: { item: Item }) => {
    const { item } = data;
    await saveConnection(item);
    navigation.goBack();
  };

  const handleOnError = async (error: { message: string; data?: { item: Item } }) => {
    const { message, data } = error;

    console.error(message);

    if (data) {
      await saveConnection(data.item);
    }
  };

  const saveConnection = async (item: Item) => {
    try {
      const previousItems: string[] = JSON.parse(
        (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
      );

      const newItems = [...previousItems, item.id];

      await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newItems));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const createConnectToken = async () => {
      const { accessToken } = await pluggyService.createConnectToken();
      setConnectToken(accessToken);
      setIsLoading(false);
    };

    createConnectToken();
  }, [pluggyService]);

  return (
    <Container>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <Container>
          <PluggyConnect
            connectToken={connectToken}
            includeSandbox={true}
            countries={['BR']}
            onSuccess={handleOnSuccess}
            onError={handleOnError}
            onClose={handleOnClose}
          />
        </Container>
      )}
    </Container>
  );
};

export default Connect;
