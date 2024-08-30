import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import Avatar from '../../components/Avatar';
import Divider from '../../components/Divider';
import ListItemSelection, {
  SelectionItem,
} from '../../components/Forms/Selection/ListItemSelection';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import Svg from '../../components/Svg';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import AppContext2 from '../../contexts/AppContext2';
import useBottomSheet from '../../hooks/useBottomSheet';
import { Wallet, WalletType } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { walletTypeText } from '../../utils/text';
import presetInstituitions, { PresetInstitution } from './helpers/presetInstitutions';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';

const SetWallet: React.FC<NativeStackScreenProps<StackRouteParamList, 'setWallet'>> = ({
  route,
  navigation,
}) => {
  const [walletValues, setWalletValues] = useState({} as Wallet);

  const walletId = route.params?.walletId;
  const isEditing = walletId !== undefined;

  const isEditingAutomaticWallet = walletValues.connection !== undefined;

  const selectedInstitution = presetInstituitions.find(
    ({ id }) => id === walletValues.institutionId,
  );

  const { wallets, createWallet, updateWallet } = useContext(AppContext2);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleWalletBalanceChange = (value: string) => {
    const balance = parseFloat(value.replace(',', '.'));
    setWalletValues((value) => ({ ...value, balance }));
  };

  const handleWalletNameChange = (name: string) => {
    setWalletValues((value) => ({ ...value, name }));
  };

  const renderWalletTypeSelector = () => {
    const handleItemPressed = (type: WalletType) => {
      setWalletValues((value) => ({
        ...value,
        type,
      }));
      closeBottomSheet();
    };

    return (
      <ListItemSelection
        title="Tipo de carteira"
        items={[
          {
            text: 'Conta corrente',
            icon: 'account-balance',
            onPress: () => handleItemPressed('CHECKING_ACCOUNT'),
          },
          {
            text: 'Conta poupança',
            icon: 'savings',
            onPress: () => handleItemPressed('SAVINGS_ACCOUNT'),
          },
        ]}
      />
    );
  };

  const renderInstitutionSelector = () => {
    const handleItemPressed = (institution: PresetInstitution) => {
      setWalletValues((value) => ({
        ...value,
        institutionId: institution.id,
        styles: {
          imageUrl: institution.imageUrl,
          primaryColor: institution.primaryColor,
        },
      }));

      closeBottomSheet();
    };

    const renderItemIcon = (institution: PresetInstitution) => (
      <Avatar color={institution.primaryColor}>
        <Svg height="100%" width="100%" src={institution.imageUrl} />
      </Avatar>
    );

    const items = presetInstituitions.map(
      (item) =>
        ({
          text: item.name,
          onPress: () => handleItemPressed(item),
          renderIcon: () => renderItemIcon(item),
        } as SelectionItem),
    );

    return <ListItemSelection title="Instituição" items={items} />;
  };

  const handleSubmitWallet = async () => {
    if (isEditing) {
      await updateWallet(walletId, walletValues);
    } else {
      createWallet({
        ...walletValues,
        id: uuid.v4().toString(),
        createdAt: new Date(),
        balance: walletValues.balance || 0,
        initialBalance: walletValues.balance || 0,
      });
    }

    navigation.goBack();
  };

  useEffect(() => {
    const initialValue = wallets.find(({ id }) => id === walletId);
    if (initialValue) {
      setWalletValues(initialValue);
    }
  }, [walletId, wallets]);

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title={isEditing ? 'Editar carteira' : 'Nova carteira'} />
        <HeaderExtensionContainer>
          <BalanceValueContainer>
            <Text typography="light" color="textWhite">
              Saldo atual
            </Text>
            <TextInput
              textPrefix="R$ "
              placeholder="0,00"
              typography="heading"
              color="textWhite"
              keyboardType="decimal-pad"
              iconRight={!isEditing ? 'edit' : undefined}
              defaultValue={walletValues.balance?.toString()}
              onChangeText={handleWalletBalanceChange}
              readOnly={isEditing}
            />
          </BalanceValueContainer>
        </HeaderExtensionContainer>
        <ScreenContent>
          <TextInput
            placeholder="Nome"
            iconLeft="font-download"
            defaultValue={walletValues.name}
            onChangeText={handleWalletNameChange}
          />
          <Divider />
          <TextInput
            placeholder="Tipo"
            iconLeft="account-balance-wallet"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderWalletTypeSelector())}
            value={walletTypeText[walletValues.type]}
            disabled={isEditingAutomaticWallet}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Instituição"
            iconLeft="circle"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderInstitutionSelector())}
            value={selectedInstitution?.name}
            readOnly={true}
          />
          <Divider />
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton icon="check" onPress={handleSubmitWallet} />
    </>
  );
};

export default SetWallet;
