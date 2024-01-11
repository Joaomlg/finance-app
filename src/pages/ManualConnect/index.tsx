import React, { useContext, useState } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Item } from '../../services/pluggy';
import { BottomSheet, Button, StyledHeader, TextInput } from './styles';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const ManualConnect: React.FC = () => {
  const [id, setId] = useState('');

  const { storeItem } = useContext(AppContext);

  const navigation = useNavigation();

  const saveConnection = () => {
    try {
      storeItem({ id } as Item);
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
