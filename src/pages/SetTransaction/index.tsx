import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import Avatar from '../../components/Avatar';
import CategoryPicker from '../../components/CategoryPicker';
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
import { Category, Transaction, TransactionType } from '../../models';
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

  const transactionId = route.params.transactionId;
  const transactionType = route.params.transactionType as TransactionType;

  const isEditing = transactionId !== undefined;

  const screenTitle = (isEditing ? 'Editar ' : 'Nova ') + transactionTypeText[transactionType];

  const { wallets, transactions, createTransaction, updateTransaction } = useContext(AppContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const selectedWallet = wallets.find(({ id }) => id === transactionValues.walletId);
  const selectedCategory = getCategoryById(transactionValues.categoryId);

  const isEditingAutomaticTransaction = isEditing && selectedWallet?.connection !== undefined;

  const handleTransactionBalanceChange = (value: string) => {
    const amount = value === '' ? undefined : parseFloat(value.replace(',', '.'));
    setTransactionValues((value) => ({ ...value, amount }));
  };

  const handleTransactionDescriptionChange = (description: string) => {
    setTransactionValues((value) => ({ ...value, description: description.trim() }));
  };

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
            renderIcon: () => (
              <Avatar color={wallet.styles.primaryColor} size={32}>
                <Svg height="100%" width="100%" src={wallet.styles.imageUrl} />
              </Avatar>
            ),
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
      setTransactionValues((value) => ({
        ...value,
        date,
      }));
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
    if (isEditing) {
      await updateTransaction(transactionId, transactionValues);
    } else {
      await createTransaction({
        ...(transactionValues as Transaction),
        id: uuid.v4().toString(),
        type: transactionType,
      });
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
            <TextInput
              textPrefix="R$ "
              placeholder="0,00"
              typography="heading"
              color="textWhite"
              keyboardType="decimal-pad"
              iconRight={!isEditingAutomaticTransaction ? 'edit' : undefined}
              defaultValue={transactionValues.amount?.toString()}
              onChangeText={handleTransactionBalanceChange}
              readOnly={isEditingAutomaticTransaction}
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
            disabled={isEditingAutomaticTransaction}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Carteira"
            iconLeft="account-balance-wallet"
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
      <ScreenFloatingButton icon="check" onPress={handleSubmitTransaction} />
    </>
  );
};

export default SetTransaction;
