import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, ListRenderItemInfo, RefreshControl, Text } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Item, ItemStatus } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import moment from 'moment';
import { SvgWithCssUri } from 'react-native-svg';
import {
  Container,
  CreatedAtText,
  FabButton,
  FabText,
  ItemContent,
  ListItem,
  ListItemAvatar,
  StatusChip,
} from './styles';

const Connections: React.FC = () => {
  const [items, setItems] = useState([] as Item[]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const pluggyService = usePluggyService();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);

    const itemsId: string[] = JSON.parse(
      (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
    );

    const items = await Promise.all(itemsId.map((id) => pluggyService.fetchItem(id)));

    setItems(items);
    setIsLoading(false);
  }, [pluggyService]);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems]),
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      Alert.alert('Apagar conexão?', 'Tem certeza que deseja apagar a conexão?', [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
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
          },
        },
      ]);
    },
    [pluggyService, items],
  );

  const getItemStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'UPDATED':
        return (
          <StatusChip backgroundColor="#dcfce7" color="#14532d">
            Atualizado
          </StatusChip>
        );
      case 'LOGIN_ERROR':
        return (
          <StatusChip backgroundColor="#fee2e2" color="#7f1d1d">
            Erro
          </StatusChip>
        );
      case 'WAITING_USER_INPUT':
        return (
          <StatusChip backgroundColor="#ffedd5" color="#7c2d12">
            MFA
          </StatusChip>
        );
      case 'OUTDATED':
        return (
          <StatusChip backgroundColor="#f5f5f4" color="#1c1917">
            Desatualizado
          </StatusChip>
        );
      case 'UPDATING':
        return (
          <StatusChip backgroundColor="#ffedd5" color="#7c2d12">
            Atualizando
          </StatusChip>
        );
    }
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => (
      <ListItem onPress={() => handleDeleteItem(item.id)}>
        <ListItemAvatar color={'#' + item.connector.primaryColor}>
          <SvgWithCssUri height="100%" width="100%" uri={item.connector.imageUrl} />
        </ListItemAvatar>
        <ItemContent>
          <Text>{item.connector.name}</Text>
          <CreatedAtText>
            Criado em: {moment(item.createdAt).format('DD/MM/YYYY hh:mm')}
          </CreatedAtText>
        </ItemContent>
        {getItemStatusBadge(item.status)}
      </ListItem>
    ),
    [handleDeleteItem],
  );

  return (
    <Container>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchItems} />}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
      />
      <FabButton
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('connect')}
      >
        <MaterialIcons name="add-circle-outline" color="white" size={20} />
        <FabText>Nova conexão</FabText>
      </FabButton>
    </Container>
  );
};

export default Connections;
