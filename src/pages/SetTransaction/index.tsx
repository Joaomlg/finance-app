import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import Avatar from '../../components/Avatar';
import CategoryIcon from '../../components/CategoryIcon';
import CategoryPicker from '../../components/CategoryPicker';
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
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import AppContext from '../../contexts/AppContext';
import useBottomSheet from '../../hooks/useBottomSheet';
import { Category, Transaction, TransactionType, Wallet } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { getCategoryById } from '../../utils/category';
import { formatDate } from '../../utils/date';
import { transactionTypeText } from '../../utils/text';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';

const SetTransaction: React.FC<NativeStackScreenProps<StackRouteParamList, 'setTransaction'>> = ({
  route,
  navigation,
}) => {
  const [transactionValues, setTransactionValues] = useState({} as Partial<Transaction>);
  const [isLoading, setLoading] = useState(false);

  const transactionId = route.params.transactionId;
  const transactionType = route.params.transactionType as TransactionType;

  const isEditing = transactionId !== undefined;

  const screenTitle = (isEditing ? 'Editar ' : 'Nova ') + transactionTypeText[transactionType];

  const { wallets, transactions, createTransaction, updateTransaction } = useContext(AppContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const selectedWallet = wallets.find(({ id }) => id === transactionValues.walletId);
  const selectedCategory = getCategoryById(transactionValues.categoryId);

  const isEditingAutomaticTransaction = isEditing && selectedWallet?.connection !== undefined;

  const handleTransactionBalanceChange = (amount: number) => {
    setTransactionValues((value) => {
      const newValue = { ...value, amount };

      if (isEditingAutomaticTransaction) {
        newValue.changed = true;

        if (!newValue.originalValues) {
          newValue.originalValues = {};
        }

        if (newValue.originalValues.amount === undefined) {
          newValue.originalValues.amount = value.amount;
        }
      }

      return newValue;
    });
  };

  const handleTransactionDescriptionChange = (description: string) => {
    setTransactionValues((value) => ({ ...value, description: description.trim() }));
  };

  const renderWalletInstitutionAvatar = (wallet: Wallet, size?: number) => (
    <Avatar color={wallet.styles.primaryColor} size={size}>
      <Svg height="100%" width="100%" src={wallet.styles.imageUrl} />
    </Avatar>
  );

  const renderTransactionWalletSelector = () => {
    const handleItemPressed = (walletId: string) => {
      setTransactionValues((value) => ({
        ...value,
        walletId,
      }));
      closeBottomSheet();
    };

    const items = wallets
      .filter((wallet) => !wallet.connection)
      .map(
        (wallet) =>
          ({
            text: wallet.name,
            renderIcon: () => renderWalletInstitutionAvatar(wallet),
            onPress: () => handleItemPressed(wallet.id),
          } as SelectionItem),
      );

    return <ListItemSelection title="Carteira" items={items} />;
  };

  const renderTransactionCategorySelector = () => {
    const handleItemPressed = ({ id }: Category) => {
      setTransactionValues((value) => ({
        ...value,
        categoryId: id,
      }));
      closeBottomSheet();
    };

    return <CategoryPicker type={transactionType} onPress={handleItemPressed} />;
  };

  const showTransactionDatePicker = () => {
    const now = new Date();

    const handleDateSelected = (date: Date) => {
      const dateWithoutTime = new Date(date.toDateString());

      setTransactionValues((value) => {
        const newValue = { ...value, date: dateWithoutTime };

        if (isEditingAutomaticTransaction) {
          newValue.changed = true;

          if (!newValue.originalValues) {
            newValue.originalValues = {};
          }

          if (newValue.originalValues.date === undefined) {
            newValue.originalValues.date = value.date;
          }
        }

        return newValue;
      });
    };

    DateTimePickerAndroid.open({
      value: transactionValues.date || now,
      onChange: (_, date) => date && handleDateSelected(date),
      mode: 'date',
      maximumDate: now,
    });
  };

  const handleTransactionIgnoreToggle = () => {
    setTransactionValues(({ ignore, ...values }) => ({
      ...values,
      ignore: !ignore,
    }));
  };

  const handleSubmitTransaction = async () => {
    setLoading(true);

    try {
      if (isEditing) {
        await updateTransaction(transactionId, transactionValues);
      } else {
        await createTransaction({
          ...(transactionValues as Transaction),
          id: uuid.v4().toString(),
          type: transactionType,
        });
      }
    } finally {
      setLoading(false);
    }

    navigation.goBack();
  };

  useEffect(() => {
    const initialValue = transactions.find(({ id }) => id === transactionId);
    if (initialValue) {
      setTransactionValues(initialValue);
    }
  }, [transactionId, transactions]);

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title={screenTitle} />
        <HeaderExtensionContainer>
          <BalanceValueContainer>
            <Text typography="light" color="textWhite">
              Valor da transação
            </Text>
            <CurrencyInput
              typography="heading"
              color="textWhite"
              iconRight="edit"
              defaultNumberValue={transactionValues.amount}
              onChangeValue={handleTransactionBalanceChange}
            />
          </BalanceValueContainer>
        </HeaderExtensionContainer>
        <ScreenContent>
          <TextInput
            placeholder="Descrição"
            iconLeft="description"
            defaultValue={transactionValues.description}
            onChangeText={handleTransactionDescriptionChange}
          />
          <Divider />
          <TextInput
            placeholder="Data"
            iconLeft="calendar-month"
            iconRight="navigate-next"
            onPress={showTransactionDatePicker}
            value={transactionValues.date ? formatDate(moment(transactionValues.date)) : undefined}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Carteira"
            iconLeft="account-balance-wallet"
            renderIconLeft={
              selectedWallet ? () => renderWalletInstitutionAvatar(selectedWallet, 24) : undefined
            }
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderTransactionWalletSelector())}
            value={selectedWallet?.name}
            disabled={isEditing}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Categoria"
            iconLeft="bookmark"
            renderIconLeft={
              selectedCategory
                ? () => <CategoryIcon category={selectedCategory} size={24} />
                : undefined
            }
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderTransactionCategorySelector())}
            value={selectedCategory?.name}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Ignorar transação"
            iconLeft="do-not-disturb-on"
            renderIconRight={() => (
              <Switch
                value={transactionValues.ignore}
                onValueChange={handleTransactionIgnoreToggle}
              />
            )}
            onPress={showTransactionDatePicker}
            readOnly
          />
          <Divider />
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        icon="check"
        onPress={handleSubmitTransaction}
        loading={isLoading}
        disabled={isLoading}
      />
    </>
  );
};

export default SetTransaction;
