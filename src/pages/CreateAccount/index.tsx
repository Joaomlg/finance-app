import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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
import useBottomSheet from '../../hooks/useBottomSheet';
import { NewAccount } from '../../models';
import { WalletSubType } from '../../models/wallet';
import { setAccount } from '../../repositories/accountRepository';
import { getSvgComponent } from '../../utils/svg';
import { accountName } from '../../utils/text';
import presetInstituitions, { PresetInstitution } from './helpers/presetInstitutions';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';
import Toast from 'react-native-toast-message';

type AccountFormValues = {
  balance: number;
  name: string;
  type: WalletSubType;
  institution: PresetInstitution;
};

const CreateAccount: React.FC = () => {
  const [accountFormValues, setAccountFormValues] = useState({} as AccountFormValues);

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const navigate = useNavigation();

  const handleAccountBalanceChange = (value: string) => {
    const balance = parseFloat(value.replace(',', '.'));
    setAccountFormValues((value) => ({ ...value, balance }));
  };

  const handleAccountNameChange = (name: string) => {
    setAccountFormValues((value) => ({ ...value, name }));
  };

  const renderAccountTypeSelector = () => {
    const handleItemPressed = (type: WalletSubType) => {
      setAccountFormValues((value) => ({
        ...value,
        type,
      }));
      closeBottomSheet();
    };

    return (
      <ListItemSelection
        title="Tipo de conta"
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
      setAccountFormValues((value) => ({
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

  const handleSubmitAccount = async () => {
    const account: NewAccount = {
      id: uuid.v4().toString(),
      name: accountFormValues.name,
      logoSvg: accountFormValues.institution.logoSvg,
      primaryColor: accountFormValues.institution.primaryColor,
      wallets: [
        {
          id: uuid.v4().toString(),
          initialBalance: accountFormValues.balance || 0,
          balance: accountFormValues.balance || 0,
          type: 'BANK',
          subtype: accountFormValues.type,
        },
      ],
      createdAt: new Date(),
    };

    try {
      await setAccount(account);
      Toast.show({ type: 'success', text1: 'Conta criada com sucesso!' });
      navigate.goBack();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a conta!' });
    }
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Nova conta" />
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
              onChangeText={handleAccountBalanceChange}
            />
          </BalanceValueContainer>
        </HeaderExtensionContainer>
        <ScreenContent>
          <TextInput
            placeholder="Nome"
            iconLeft="font-download"
            onChangeText={handleAccountNameChange}
          />
          <Divider />
          <TextInput
            placeholder="Tipo"
            iconLeft="account-balance-wallet"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderAccountTypeSelector())}
            value={accountName[accountFormValues.type]}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Instituição"
            iconLeft="circle"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderInstitutionSelector())}
            value={accountFormValues.institution?.name}
            readOnly={true}
          />
          <Divider />
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton icon="check" onPress={handleSubmitAccount} />
    </>
  );
};

export default CreateAccount;
