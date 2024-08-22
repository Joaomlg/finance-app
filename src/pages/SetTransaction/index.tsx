import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import Avatar from '../../components/Avatar';
import Divider from '../../components/Divider';
import ListItemSelection, {
  SelectionItem,
} from '../../components/Forms/Selection/ListItemSelection';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import AppContext2 from '../../contexts/AppContext2';
import useBottomSheet from '../../hooks/useBottomSheet';
import { Transaction, TransactionType } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDate } from '../../utils/date';
import { formatMoney } from '../../utils/money';
import { getSvgComponent } from '../../utils/svg';
import { transactionName } from '../../utils/text';
import { BalanceValueContainer, HeaderExtensionContainer } from './styles';
import uuid from 'react-native-uuid';

const SetTransaction: React.FC<NativeStackScreenProps<StackRouteParamList, 'setTransaction'>> = ({
  route,
  navigation,
}) => {
  const [transactionValues, setTransactionValues] = useState({} as Transaction);

  const transactionId = route.params?.transactionId;
  const isEditing = transactionId !== undefined;

  const { wallets, transactions, createTransaction, updateTransaction } = useContext(AppContext2);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const selectedWallet = wallets.find(({ id }) => id === transactionValues.walletId);

  const handleTransactionBalanceChange = (value: string) => {
    const amount = parseFloat(value.replace(',', '.'));
    setTransactionValues((value) => ({ ...value, amount }));
  };

  const handleTransactionDescriptionChange = (description: string) => {
    setTransactionValues((value) => ({ ...value, description }));
  };

  const renderTransactionWalletSelector = () => {
    const handleItemPressed = (walletId: string) => {
      setTransactionValues((value) => ({
        ...value,
        walletId,
      }));
      closeBottomSheet();
    };

    const items = wallets.map((wallet) => {
      const LogoSvgComponent = getSvgComponent(wallet.styles.logoSvg);

      return {
        text: wallet.name,
        renderIcon: () => (
          <Avatar color={wallet.styles.primaryColor} size={32}>
            <LogoSvgComponent height="100%" width="100%" />
          </Avatar>
        ),
        onPress: () => handleItemPressed(wallet.id),
      } as SelectionItem;
    });

    return <ListItemSelection title="Carteira" items={items} />;
  };

  const renderTransactionTypeSelector = () => {
    const handleItemPressed = (type: TransactionType) => {
      setTransactionValues((value) => ({
        ...value,
        type,
      }));
      closeBottomSheet();
    };

    return (
      <ListItemSelection
        title="Tipo de transação"
        items={[
          {
            text: 'Entrada',
            icon: 'attach-money',
            onPress: () => handleItemPressed('CREDIT'),
          },
          {
            text: 'Saída',
            icon: 'shopping-cart',
            onPress: () => handleItemPressed('DEBIT'),
          },
        ]}
      />
    );
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
      createTransaction({
        ...transactionValues,
        id: uuid.v4().toString(),
        date: new Date(),
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
        <ScreenHeader title={isEditing ? 'Editar transação' : 'Nova transação'} />
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
              iconRight={!isEditing ? 'edit' : undefined}
              defaultValue={
                transactionValues.amount
                  ? formatMoney({ value: transactionValues.amount })
                  : undefined
              }
              onChangeText={handleTransactionBalanceChange}
              readOnly={isEditing}
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
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderTransactionWalletSelector())}
            value={selectedWallet?.name}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Tipo"
            iconLeft="paid"
            iconRight="navigate-next"
            onPress={() => openBottomSheet(renderTransactionTypeSelector())}
            value={transactionName[transactionValues.type]}
            readOnly
          />
          <Divider />
          <TextInput
            placeholder="Ignorar transação"
            iconLeft="do-not-disturb-on"
            renderIconRight={() => (
              <Switch value={transactionValues.ignore} onChange={handleTransactionIgnoreToggle} />
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