import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
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
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import AppContext2 from '../../contexts/AppContext2';
import useBottomSheet from '../../hooks/useBottomSheet';
import { WalletType } from '../../models';
import { getSvgComponent } from '../../utils/svg';
import { accountName } from '../../utils/text';
import presetInstituitions, { PresetInstitution } from './helpers/presetInstitutions';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';

type WalletFormValues = {
  balance: number;
  name: string;
  type: WalletType;
  institution: PresetInstitution;
};

const SetWallet: React.FC = () => {
  const [walletFormValues, setWalletFormValues] = useState({} as WalletFormValues);

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { setWallet } = useContext(AppContext2);

  const navigate = useNavigation();

  const handleWalletBalanceChange = (value: string) => {
    const balance = parseFloat(value.replace(',', '.'));
    setWalletFormValues((value) => ({ ...value, balance }));
  };

  const handleWalletNameChange = (name: string) => {
    setWalletFormValues((value) => ({ ...value, name }));
  };

  const renderWalletTypeSelector = () => {
    const handleItemPressed = (type: WalletType) => {
      setWalletFormValues((value) => ({
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
      setWalletFormValues((value) => ({
        ...value,
        institution,
      }));
      closeBottomSheet();
    };

    const renderItemIcon = (institution: PresetInstitution) => {
      const Svg = getSvgComponent(institution.logoSvg);
      return (
        <Avatar color={institution.primaryColor}>
          <Svg height="100%" width="100%" />
        </Avatar>
      );
    };
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
    await setWallet({
      id: uuid.v4().toString(),
      name: walletFormValues.name,
      styles: {
        logoSvg: walletFormValues.institution.logoSvg,
        primaryColor: walletFormValues.institution.primaryColor,
      },
      initialBalance: walletFormValues.balance || 0,
      balance: walletFormValues.balance || 0,
      type: walletFormValues.type,
      createdAt: new Date(),
      institutionId: walletFormValues.institution.id,
    });
    navigate.goBack();
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Nova carteira" />
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
              iconRight="edit"
              onChangeText={handleWalletBalanceChange}
            />
          </BalanceValueContainer>
        </HeaderExtensionContainer>
        <ScreenContent>
          <TextInput
            placeholder="Nome"
            iconLeft="font-download"
            onChangeText={handleWalletNameChange}
          />
          <Divider />
          <TextInput
            placeholder="Tipo"
            iconLeft="account-balance-wallet"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderWalletTypeSelector())}
            value={accountName[walletFormValues.type]}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Instituição"
            iconLeft="circle"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderInstitutionSelector())}
            value={walletFormValues.institution?.name}
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
