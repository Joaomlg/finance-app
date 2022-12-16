import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Text } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Item } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';
import { MaterialIcons } from '@expo/vector-icons';

import { Container, ItemAction, ItemAvatar, ItemCard, ItemInfo, LoadingContainer } from './styles';

const Accounts: React.FC = () => {
  const [items, setItems] = useState([] as Item[]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const pluggyService = usePluggyService();

  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        const itemsId: string[] = JSON.parse(
          (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
        );

        const items = await Promise.all(itemsId.map((id) => pluggyService.fetchItem(id)));

        setItems(items);
        setIsLoading(false);
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
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" />
        </LoadingContainer>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ItemCard key={item.id}>
                <ItemAvatar uri={item.connector.imageUrl} />
                <ItemInfo>
                  <Text>{item.connector.name}</Text>
                  <Text>Status: {item.status}</Text>
                </ItemInfo>
                <ItemAction>
                  <MaterialIcons
                    name="delete"
                    size={28}
                    onPress={() => handleDeleteItem(item.id)}
                  />
                </ItemAction>
              </ItemCard>
            )}
            keyExtractor={(item) => item.id}
          />
          <Button
            title="Conectar uma conta"
            onPress={() => navigation.navigate('connect')}
          ></Button>
        </>
      )}
    </Container>
  );
};

export default Accounts;
