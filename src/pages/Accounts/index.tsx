import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Button, Text } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Item } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import { Container, ItemCard } from './styles';

const Accounts: React.FC = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState([] as Item[]);

  const pluggyService = usePluggyService();

  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        const itemsId: string[] = JSON.parse(
          (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
        );

        const items = await Promise.all(itemsId.map((id) => pluggyService.fetchItem(id)));

        setItems(items);
      };

      fetchItems();
    }, [pluggyService]),
  );

  const handleDeleteItem = async (id: string) => {
    Alert.alert('Apagar conexão?', 'Tem certeza que deseja apagar a conexão?', [
      { text: 'Cancelar', onPress: () => {} },
      { text: 'Apagar', onPress: async () => await tryDeleteItem(id) },
    ]);
  };

  const tryDeleteItem = async (id: string) => {
    try {
      await pluggyService.deleteItem(id);

      const previousItemsId: string[] = JSON.parse(
        (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
      );

      const newItemsId = previousItemsId.filter((itemId) => itemId !== id);

      await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newItemsId));

      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      {items.map((item) => (
        <ItemCard key={item.id} onPress={() => handleDeleteItem(item.id)}>
          <Text>{item.id}</Text>
          <Text>{item.connector.name}</Text>
          <Text>{item.status}</Text>
          <Text>{item.connector.hasMFA ? 'With MFA' : 'Without MFA'}</Text>
        </ItemCard>
      ))}
      <Button title="Conectar uma conta" onPress={() => navigation.navigate('connect')}></Button>
    </Container>
  );
};

export default Accounts;
