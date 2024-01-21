import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { BottomSheet, Button, StyledHeader, TextInput } from './styles';

const ManualConnect: React.FC = () => {
  const [id, setId] = useState('');

  const { storeConnection } = useContext(AppContext);

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

  return (
    <ScreenContainer>
      <StyledHeader title="Conexão manual" />
      <BottomSheet>
        <TextInput placeholder="Identificador" onChangeText={setId} value={id} />
        <Button onPress={saveConnection}>
          <Text variant="title" color="textWhite">
            Adicionar
          </Text>
        </Button>
      </BottomSheet>
    </ScreenContainer>
  );
};

export default ManualConnect;
