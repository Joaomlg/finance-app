import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';
import usePluggyService from '../../hooks/pluggyService';
import { Connector, Item } from '../../services/pluggy';
import { ItemsAsyncStorageKey } from '../../utils/contants';

import { Container, Input, Title } from './styles';

type RouteParams = {
  connectorId: number;
};

const CreateConnection: React.FC = () => {
  const route: RouteProp<{ params: RouteParams }> = useRoute();
  const { connectorId } = route.params;

  const [connector, setConnector] = useState({} as Connector);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const pluggyService = usePluggyService();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const connector = await pluggyService.fetchConnector(connectorId);
      setConnector(connector);
      setIsLoading(false);
    };

    fetchData();
  }, [pluggyService, connectorId]);

  const handleInputChanged = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateConnection = async () => {
    try {
      const item = await pluggyService.createItem(connectorId, formData);

      const previousItems: string[] = JSON.parse(
        (await AsyncStorage.getItem(ItemsAsyncStorageKey)) || '[]',
      );

      const newItems = [...previousItems, item.id];

      await AsyncStorage.setItem(ItemsAsyncStorageKey, JSON.stringify(newItems));

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <Title>{connector.name}</Title>
          {connector.credentials.map((credential) => (
            <View key={credential.name}>
              <Text>{credential.name}</Text>
              <Input
                placeholder={credential.placeholder}
                secureTextEntry={credential.type == 'password'}
                onChangeText={(value) => handleInputChanged(credential.name, value)}
              />
            </View>
          ))}
          <Button title="Connectar" onPress={handleCreateConnection} />
        </>
      )}
    </Container>
  );
};

export default CreateConnection;
