import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import Avatar from '../../components/Avatar';
import CurrencyInput from '../../components/CurrencyInput';
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
import AppContext from '../../contexts/AppContext';
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
  const [isLoading, setLoading] = useState(false);

  const walletId = route.params?.walletId;
  const isEditing = walletId !== undefined;

  const isEditingAutomaticWallet = walletValues.connection !== undefined;

  const selectedInstitution = presetInstituitions.find(
    ({ id }) => id === walletValues.institutionId,
  );

  const { wallets, createWallet, updateWallet } = useContext(AppContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleWalletBalanceChange = (balance: number) => {
    setWalletValues((value) => ({ ...value, balance }));
  };

  const handleWalletNameChange = (name: string) => {
    setWalletValues((value) => ({ ...value, name: name.trim() }));
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

  const renderInstitutionAvatar = (institution: PresetInstitution, size?: number) => (
    <Avatar color={institution.primaryColor} size={size}>
      <Svg height="100%" width="100%" src={institution.imageUrl} />
    </Avatar>
  );

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

    const items = presetInstituitions.map(
      (item) =>
        ({
          text: item.name,
          onPress: () => handleItemPressed(item),
          renderIcon: () => renderInstitutionAvatar(item),
        } as SelectionItem),
    );

    return <ListItemSelection title="Instituição" items={items} />;
  };

  const handleSubmitWallet = async () => {
    setLoading(true);

    try {
      if (isEditing) {
        await updateWallet(walletId, walletValues);
      } else {
        await createWallet({
          ...walletValues,
          id: uuid.v4().toString(),
          createdAt: new Date(),
          balance: walletValues.balance || 0,
          initialBalance: walletValues.balance || 0,
        });
      }
    } finally {
      setLoading(false);
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
            <CurrencyInput
              typography="heading"
              color="textWhite"
              iconRight={!isEditing ? 'edit' : undefined}
              defaultNumberValue={walletValues.balance}
              onChangeValue={handleWalletBalanceChange}
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
            renderIconLeft={
              selectedInstitution
                ? () => renderInstitutionAvatar(selectedInstitution, 24)
                : undefined
            }
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderInstitutionSelector())}
            value={selectedInstitution?.name}
            readOnly={true}
          />
          <Divider />
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        icon="check"
        onPress={handleSubmitWallet}
        loading={isLoading}
        disabled={isLoading}
      />
    </>
  );
};

export default SetWallet;
