import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import Avatar from '../../components/Avatar';
import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import AppContext2 from '../../contexts/AppContext2';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDateHourFull } from '../../utils/date';
import { transactionName } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, InformationGroup, Line } from './styles';

const TransactionDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'transaction'>> = ({
  route,
  navigation,
}) => {
  const { wallets, transactions, updateTransaction, deleteTransaction } = useContext(AppContext2);
  const theme = useTheme();

  const transaction = transactions.find(({ id }) => id === route.params.transactionId);

  if (!transaction) return;

  const wallet = wallets.find(({ id }) => id === transaction.walletId);

  const toggleIgnore = async () => {
    updateTransaction(transaction.id, {
      ignore: !transaction.ignore,
    });
  };

  const handleEditTransaction = () => {
    navigation.navigate('setTransaction', { transactionId: transaction.id });
  };

  const handleDeleteTransaction = async () => {
    Alert.alert(
      'Apagar transação?',
      'Tem certeza que deseja apagar a transação?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteTransaction(transaction);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Detalhes" actions={[HideValuesAction()]} />
        <ScreenContent>
          <BottomHeader>
            <Avatar
              color={transaction.type === 'CREDIT' ? theme.colors.income : theme.colors.expense}
              size={48}
            >
              <Icon
                name={transaction.type === 'CREDIT' ? 'attach-money' : 'shopping-cart'}
                size={32}
                color={transaction.type === 'CREDIT' ? 'income' : 'expense'}
              />
            </Avatar>
            <BottomHeaderContent>
              <Text typography="heading">{transaction.description}</Text>
              {transaction.category && (
                <Text typography="extraLight" color="textLight" selectable={true}>
                  {transaction.category}
                </Text>
              )}
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <Line>
              <Text>Criado em</Text>
              <Text typography="defaultBold">{formatDateHourFull(moment(transaction.date))}</Text>
            </Line>
            <Line>
              <Text>Conta</Text>
              <Text typography="defaultBold">{wallet?.name}</Text>
            </Line>
            <Line>
              <Text>Tipo</Text>
              <Text typography="defaultBold">{transactionName[transaction.type]}</Text>
            </Line>
          </InformationGroup>
          <Divider />
          <InformationGroup>
            <Line>
              <Text>Valor</Text>
              <Money
                typography="defaultBold"
                value={transaction.type === 'DEBIT' ? -1 * transaction.amount : transaction.amount}
              />
            </Line>
          </InformationGroup>
          <Divider />
          <Line>
            <Text>Ignorar transação</Text>
            <Switch onValueChange={toggleIgnore} value={transaction.ignore} />
          </Line>
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          { text: 'Editar', icon: 'edit', onPress: handleEditTransaction },
          { text: 'Remover', icon: 'delete', onPress: handleDeleteTransaction },
        ]}
        icon="more-horiz"
      />
    </>
  );
};

export default TransactionDetail;
