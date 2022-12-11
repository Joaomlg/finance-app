import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import usePluggyService from '../../hooks/pluggy';
import { Connector } from '../../services/pluggy/types/connector';

import { Container, Item, ItemSeparator, Title } from './styles';

const Connect: React.FC = () => {
  const [connectors, setConnectors] = useState([] as Connector[])
  const [isLoading, setIsLoading] = useState(true);
  const pluggyService = usePluggyService();

  useEffect(() => {
    const fetchData = async () => {
      const { results } = await pluggyService.fetchConnectors({
        countries: ['BR'],
        types: ['PERSONAL_BANK']
      });
      setConnectors(results);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <Container>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={connectors}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Item>
              <SvgUri height={60} width={60} uri={item.imageUrl} />
              <Title>{item.name}</Title>
            </Item>
          )}
          ItemSeparatorComponent={() => (
            <ItemSeparator />
          )}
        />
      )}
    </Container>
  );
}

export default Connect;