import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Item, ItemStatus } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import moment from 'moment';
import {
  Actionsheet,
  Avatar,
  Badge,
  Box,
  Fab,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from 'native-base';
import { SvgWithCssUri } from 'react-native-svg';
import { Container } from './styles';

const Connections: React.FC = () => {
  const [items, setItems] = useState([] as Item[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isActionSheetOpened, setActionSheetOpened] = useState(false);

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

  const handleItemPressed = (id: string) => {
    setSelectedItemId(id);
    setActionSheetOpened(true);
  };

  const handleActionSheetClosed = () => {
    setActionSheetOpened(false);
  };

  const handleDeleteItem = async () => {
    Alert.alert('Apagar conexão?', 'Tem certeza que deseja apagar a conexão?', [
      { text: 'Cancelar', onPress: () => {} },
      { text: 'Apagar', onPress: async () => await tryDeleteItem(selectedItemId) },
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

      setActionSheetOpened(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getItemStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'UPDATED':
        return <Badge colorScheme="success">Atualizado</Badge>;
      case 'LOGIN_ERROR':
        return <Badge colorScheme="danger">Erro</Badge>;
      case 'WAITING_USER_INPUT':
        return <Badge colorScheme="warning">MFA</Badge>;
      case 'OUTDATED':
        return <Badge colorScheme="dark">Desatualizado</Badge>;
      case 'UPDATING':
        return <Badge colorScheme="warning">Atualizando</Badge>;
    }
  };

  return (
    <Container>
      <FlatList
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchItems} />}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPressed(item.id)}>
            <Box borderWidth="1" borderColor="coolGray.200" borderRadius="lg" marginBottom={3}>
              <HStack padding={4} space={3} alignItems="center">
                <Avatar
                  backgroundColor="transparent"
                  borderWidth="1"
                  borderColor={'#' + item.connector.primaryColor}
                >
                  <SvgWithCssUri height="100%" width="100%" uri={item.connector.imageUrl} />
                </Avatar>
                <VStack>
                  <Text isTruncated maxWidth="150">
                    {item.connector.name}
                  </Text>
                  <Text fontWeight="thin">
                    Criado em: {moment(item.createdAt).format('DD/MM/YYYY hh:mm')}
                  </Text>
                </VStack>
                <Spacer />
                {getItemStatusBadge(item.status)}
              </HStack>
            </Box>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
      />
      <Actionsheet isOpen={isActionSheetOpened} onClose={handleActionSheetClosed} size="full">
        <Actionsheet.Content>
          <Box px={4}>
            <Text fontSize="16" color="gray.500">
              Opções
            </Text>
          </Box>
          <Actionsheet.Item disabled startIcon={<Icon as={MaterialIcons} size="6" name="edit" />}>
            Editar
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={MaterialIcons} size="6" name="delete" />}
            onPress={handleDeleteItem}
          >
            Apagar
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Fab
        renderInPortal={false}
        size="lg"
        icon={<Icon name="add-circle-outline" as={MaterialIcons} color="white" />}
        label="Nova conexão"
        onPress={() => navigation.navigate('connect')}
      />
    </Container>
  );
};

export default Connections;
