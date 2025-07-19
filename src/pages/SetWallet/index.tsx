import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { onSubmitError, useYupValidationResolver } from '../../utils/forms';
import { walletTypeText } from '../../utils/text';
import presetInstituitions, { PresetInstitution } from './helpers/presetInstitutions';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';
import walletSchema from './walletSchema';

const SetWallet: React.FC<NativeStackScreenProps<StackRouteParamList, 'setWallet'>> = ({
  route,
  navigation,
}) => {
  const [isLoading, setLoading] = useState(false);

  const { reset, setValue, watch, handleSubmit } = useForm<Wallet>({
    resolver: useYupValidationResolver(walletSchema),
  });

  const { wallets, createWallet, updateWallet } = useContext(AppContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const walletId = route.params?.walletId;
  const isEditing = walletId !== undefined;

  const isEditingAutomaticWallet = watch('connection') !== undefined;

  const selectedInstitution = presetInstituitions.find(({ id }) => id == watch('institutionId'));

  const renderWalletTypeSelector = () => {
    const handleItemPressed = (type: WalletType) => {
      setValue('type', type);
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
          {
            text: 'Cartão de crédito',
            icon: 'credit-card',
            onPress: () => handleItemPressed('CREDIT_CARD'),
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
      setValue('institutionId', institution.id);
      setValue('styles', {
        imageUrl: institution.imageUrl,
        primaryColor: institution.primaryColor,
      });
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

  const onSubmitWallet = async (data: Wallet) => {
    setLoading(true);

    try {
      if (isEditing) {
        await updateWallet(walletId, data);
      } else {
        await createWallet({
          ...data,
          id: uuid.v4().toString(),
          createdAt: new Date(),
          balance: data.balance || 0,
          initialBalance: data.balance || 0,
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
      reset(initialValue);
    }
  }, [reset, walletId, wallets]);

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
              defaultNumberValue={watch('balance')}
              onChangeValue={(value) => setValue('balance', value)}
              readOnly={isEditing}
            />
          </BalanceValueContainer>
        </HeaderExtensionContainer>
        <ScreenContent>
          <TextInput
            placeholder="Nome"
            iconLeft="font-download"
            defaultValue={watch('name')}
            onChangeText={(value) => setValue('name', value)}
          />
          <Divider />
          <TextInput
            placeholder="Tipo"
            iconLeft="account-balance-wallet"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderWalletTypeSelector())}
            value={walletTypeText[watch('type')]}
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
        onPress={handleSubmit(onSubmitWallet, onSubmitError)}
        loading={isLoading}
        disabled={isLoading}
      />
    </>
  );
};

export default SetWallet;
