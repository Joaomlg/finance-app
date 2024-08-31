import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import Divider from '../../components/Divider';
import ListItemSelection from '../../components/Forms/Selection/ListItemSelection';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import TextInput from '../../components/TextInput';
import AppContext2 from '../../contexts/AppContext2';
import useBelvoService from '../../hooks/useBelvoService';
import useBottomSheet from '../../hooks/useBottomSheet';
import usePluggyService from '../../hooks/usePluggyService';
import Provider from '../../models/provider';

const ManualConnect: React.FC = () => {
  const [id, setId] = useState('');
  const [provider, setProvider] = useState<Provider | undefined>();

  const { setupConnection } = useContext(AppContext2);

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const navigation = useNavigation();
  const pluggyService = usePluggyService();
  const belvoService = useBelvoService();

  const renderWalletTypeSelector = () => {
    const handleItemPressed = (provider: Provider) => {
      setProvider(provider);
      closeBottomSheet();
    };

    return (
      <ListItemSelection
        title="Provedor"
        items={[
          {
            text: 'Pluggy',
            onPress: () => handleItemPressed('PLUGGY'),
          },
          {
            text: 'Belvo',
            onPress: () => handleItemPressed('BELVO'),
          },
        ]}
      />
    );
  };

  const saveConnection = async () => {
    try {
      await setupConnection(id, provider === 'PLUGGY' ? pluggyService : belvoService);
      Toast.show({ type: 'success', text1: 'Conexão adicionada com sucesso!' });
      navigation.navigate('wallets');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Não foi possível adicionar a conexão!' });
    }
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Conexão manual" />
        <ScreenContent>
          <TextInput
            iconLeft="font-download"
            placeholder="Identificador"
            onChangeText={setId}
            value={id}
          />
          <Divider />
          <TextInput
            placeholder="Provedor"
            iconLeft="hub"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderWalletTypeSelector())}
            value={provider}
            readOnly
          />
          <Divider />
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton icon="check" onPress={saveConnection} />
    </>
  );
};

export default ManualConnect;
