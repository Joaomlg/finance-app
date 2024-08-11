import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import ScreenContainer from '../../components/ScreenContainer';
import { ScreenContent } from '../../components/ScreenContent';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Button, StyledHeader, TextInput } from './styles';

const ManualConnect: React.FC = () => {
  const [id, setId] = useState('');

  const { storeConnection, deleteConnection } = useContext(AppContext);

  const navigation = useNavigation();

  const saveConnection = () => {
    try {
      storeConnection(id, 'PLUGGY');
      Toast.show({ type: 'success', text1: 'Conexão adicionada com sucesso!' });
      navigation.navigate('connections');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Não foi possível adicionar a conexão!' });
    }
  };

  const RemoveConnection = () => {
    try {
      deleteConnection(id);
      Toast.show({ type: 'success', text1: 'Conexão removida com sucesso!' });
      navigation.navigate('connections');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Não foi possível remover a conexão!' });
    }
  };

  return (
    <ScreenContainer>
      <StyledHeader title="Conexão manual" />
      <ScreenContent>
        <TextInput placeholder="Identificador" onChangeText={setId} value={id} />
        <Button onPress={saveConnection}>
          <Text variant="title" color="textWhite">
            Adicionar
          </Text>
        </Button>
        <Button onPress={RemoveConnection}>
          <Text variant="title" color="textWhite">
            Remover
          </Text>
        </Button>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ManualConnect;
